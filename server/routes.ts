import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMaterialSchema, type PredictionResult, type CandidateGenerationRequest } from "@shared/schema";
import { z } from "zod";

const predictRequestSchema = z.object({
  materialId: z.string(),
});

const generateRequestSchema = z.object({
  baseFormula: z.string().optional(),
  targetEnergyDensity: z.number().optional(),
  targetVoltage: z.number().optional(),
  count: z.number().min(1).max(50).default(10),
  constraints: z.object({
    elements: z.array(z.string()).optional(),
    excludeElements: z.array(z.string()).optional(),
    maxAtoms: z.number().optional(),
    spaceGroups: z.array(z.string()).optional(),
  }).optional(),
});

const datasetQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
});

function generateMockPrediction(materialId: string, materialName: string): PredictionResult {
  const baseEnergy = 150 + Math.random() * 200;
  const baseVoltage = 2.5 + Math.random() * 2;
  const baseConductivity = Math.random() * 0.01;
  const baseStability = 400 + Math.random() * 200;
  const baseCycleLife = Math.floor(500 + Math.random() * 2000);

  return {
    materialId,
    materialName,
    energyDensity: baseEnergy,
    voltageWindow: baseVoltage,
    ionicConductivity: baseConductivity,
    thermalStability: baseStability,
    cycleLife: baseCycleLife,
    uncertainty: {
      energyDensity: baseEnergy * 0.05 * Math.random(),
      voltageWindow: baseVoltage * 0.03 * Math.random(),
      ionicConductivity: baseConductivity * 0.1 * Math.random(),
      thermalStability: baseStability * 0.04 * Math.random(),
      cycleLife: baseCycleLife * 0.08 * Math.random(),
    },
    descriptors: {
      bandGap: 1.5 + Math.random() * 3,
      formationEnergy: -2 + Math.random() * 1,
      ionicRadius: 0.5 + Math.random() * 0.5,
      electronegativity: 1.5 + Math.random() * 2,
      density: 3 + Math.random() * 4,
    },
    physicsValidation: {
      chargeNeutrality: Math.random() > 0.1,
      energyConservation: Math.random() > 0.1,
      thermodynamicStability: Math.random() > 0.2,
      structuralIntegrity: Math.random() > 0.15,
    },
  };
}

function generateCandidateFormulas(count: number, constraints?: CandidateGenerationRequest["constraints"]): string[] {
  const elements = constraints?.elements?.length 
    ? constraints.elements 
    : ["Li", "Na", "K", "Mg", "Ca", "Co", "Ni", "Mn", "Fe", "V", "Ti", "O", "S", "P", "F"];
  
  const excludeElements = new Set(constraints?.excludeElements || []);
  const validElements = elements.filter(el => !excludeElements.has(el));
  
  const templates = [
    (els: string[]) => `${els[0]}${els[1]}O2`,
    (els: string[]) => `${els[0]}2${els[1]}O4`,
    (els: string[]) => `${els[0]}${els[1]}PO4`,
    (els: string[]) => `${els[0]}3${els[1]}2(PO4)3`,
    (els: string[]) => `${els[0]}${els[1]}2O4`,
    (els: string[]) => `${els[0]}2${els[1]}O3`,
    (els: string[]) => `${els[0]}${els[1]}${els[2]}O4`,
    (els: string[]) => `${els[0]}7${els[1]}3${els[2]}2O12`,
  ];
  
  const formulas: string[] = [];
  for (let i = 0; i < count; i++) {
    const shuffled = [...validElements].sort(() => Math.random() - 0.5);
    const template = templates[Math.floor(Math.random() * templates.length)];
    formulas.push(template(shuffled));
  }
  
  return formulas;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/materials", async (req, res) => {
    try {
      const materials = await storage.getMaterials();
      res.json(materials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch materials" });
    }
  });

  app.get("/api/materials/:id", async (req, res) => {
    try {
      const material = await storage.getMaterial(req.params.id);
      if (!material) {
        return res.status(404).json({ error: "Material not found" });
      }
      res.json(material);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch material" });
    }
  });

  app.post("/api/materials", async (req, res) => {
    try {
      const validatedData = insertMaterialSchema.parse(req.body);
      const material = await storage.createMaterial(validatedData);
      res.status(201).json(material);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid material data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create material" });
    }
  });

  app.delete("/api/materials/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMaterial(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Material not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete material" });
    }
  });

  app.post("/api/predict", async (req, res) => {
    try {
      const { materialId } = predictRequestSchema.parse(req.body);
      
      const material = await storage.getMaterial(materialId);
      if (!material) {
        return res.status(404).json({ error: "Material not found" });
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const predictionResult = generateMockPrediction(
        materialId, 
        material.name
      );
      
      await storage.createPrediction({
        materialId,
        energyDensity: predictionResult.energyDensity,
        voltageWindow: predictionResult.voltageWindow,
        ionicConductivity: predictionResult.ionicConductivity,
        thermalStability: predictionResult.thermalStability,
        cycleLife: predictionResult.cycleLife,
        uncertainty: predictionResult.uncertainty,
        descriptors: predictionResult.descriptors,
        physicsValidation: predictionResult.physicsValidation,
      });
      
      res.json(predictionResult);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      res.status(500).json({ error: "Prediction failed" });
    }
  });

  app.post("/api/generate", async (req, res) => {
    try {
      const params = generateRequestSchema.parse(req.body);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const formulas = generateCandidateFormulas(params.count, params.constraints);
      
      const candidatesData = formulas.map((formula, index) => ({
        formula,
        parentMaterialId: null,
        structure: null,
        predictedProperties: {
          energyDensity: (params.targetEnergyDensity || 200) * (0.8 + Math.random() * 0.4),
          voltage: (params.targetVoltage || 3.5) * (0.85 + Math.random() * 0.3),
          conductivity: Math.random() * 0.01,
          stability: 400 + Math.random() * 200,
        },
        score: 0.6 + Math.random() * 0.4,
      }));
      
      candidatesData.sort((a, b) => (b.score || 0) - (a.score || 0));
      
      const candidates = await storage.createCandidates(candidatesData);
      
      res.json({ candidates });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      res.status(500).json({ error: "Generation failed" });
    }
  });

  app.get("/api/dataset", async (req, res) => {
    try {
      const params = datasetQuerySchema.parse(req.query);
      const result = await storage.getDatasetEntries(params);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid query parameters", details: error.errors });
      }
      res.status(500).json({ error: "Failed to fetch dataset" });
    }
  });

  app.get("/api/dataset/:id", async (req, res) => {
    try {
      const entry = await storage.getDatasetEntry(req.params.id);
      if (!entry) {
        return res.status(404).json({ error: "Entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch entry" });
    }
  });

  app.get("/api/predictions/:materialId", async (req, res) => {
    try {
      const predictions = await storage.getPredictionsByMaterial(req.params.materialId);
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch predictions" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  return httpServer;
}

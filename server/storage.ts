import { 
  type User, 
  type InsertUser,
  type Material,
  type InsertMaterial,
  type Prediction,
  type InsertPrediction,
  type Candidate,
  type InsertCandidate,
  type DatasetEntry,
  type InsertDatasetEntry
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Materials
  getMaterial(id: string): Promise<Material | undefined>;
  getMaterials(): Promise<Material[]>;
  createMaterial(material: InsertMaterial): Promise<Material>;
  deleteMaterial(id: string): Promise<boolean>;
  
  // Predictions
  getPrediction(id: string): Promise<Prediction | undefined>;
  getPredictionsByMaterial(materialId: string): Promise<Prediction[]>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  
  // Candidates
  getCandidates(): Promise<Candidate[]>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  createCandidates(candidates: InsertCandidate[]): Promise<Candidate[]>;
  
  // Dataset
  getDatasetEntries(params?: { 
    page?: number; 
    limit?: number; 
    category?: string;
    search?: string;
  }): Promise<{ entries: DatasetEntry[]; total: number }>;
  getDatasetEntry(id: string): Promise<DatasetEntry | undefined>;
  createDatasetEntry(entry: InsertDatasetEntry): Promise<DatasetEntry>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private materials: Map<string, Material>;
  private predictions: Map<string, Prediction>;
  private candidates: Map<string, Candidate>;
  private datasetEntries: Map<string, DatasetEntry>;

  constructor() {
    this.users = new Map();
    this.materials = new Map();
    this.predictions = new Map();
    this.candidates = new Map();
    this.datasetEntries = new Map();
    
    this.seedDataset();
  }

  private seedDataset() {
    const sampleMaterials: Omit<DatasetEntry, "id">[] = [
      {
        materialId: "mp-22526",
        name: "Lithium Cobalt Oxide",
        formula: "LiCoO2",
        category: "Lithium-ion",
        spaceGroup: "R-3m",
        energyDensity: 274,
        voltageWindow: 3.9,
        ionicConductivity: 1e-4,
        source: "Materials Project",
      },
      {
        materialId: "mp-19017",
        name: "Lithium Iron Phosphate",
        formula: "LiFePO4",
        category: "Lithium-ion",
        spaceGroup: "Pnma",
        energyDensity: 170,
        voltageWindow: 3.4,
        ionicConductivity: 1e-9,
        source: "Materials Project",
      },
      {
        materialId: "mp-18748",
        name: "Lithium Manganese Oxide",
        formula: "LiMn2O4",
        category: "Lithium-ion",
        spaceGroup: "Fd-3m",
        energyDensity: 148,
        voltageWindow: 4.1,
        ionicConductivity: 1e-5,
        source: "Materials Project",
      },
      {
        materialId: "mp-35416",
        name: "Sodium Vanadium Phosphate",
        formula: "Na3V2(PO4)3",
        category: "Sodium-ion",
        spaceGroup: "R-3c",
        energyDensity: 117,
        voltageWindow: 3.4,
        ionicConductivity: 1e-6,
        source: "ICSD",
      },
      {
        materialId: "mp-29283",
        name: "Sodium Iron Fluorophosphate",
        formula: "Na2FePO4F",
        category: "Sodium-ion",
        spaceGroup: "Pbcn",
        energyDensity: 124,
        voltageWindow: 3.0,
        ionicConductivity: 1e-7,
        source: "ICSD",
      },
      {
        materialId: "mp-985583",
        name: "Lithium Lanthanum Zirconium Oxide",
        formula: "Li7La3Zr2O12",
        category: "Solid-state",
        spaceGroup: "Ia-3d",
        energyDensity: 0,
        voltageWindow: 5.0,
        ionicConductivity: 1e-3,
        source: "Materials Project",
      },
      {
        materialId: "mp-696114",
        name: "Lithium Phosphorus Sulfide",
        formula: "Li3PS4",
        category: "Solid-state",
        spaceGroup: "Pnma",
        energyDensity: 0,
        voltageWindow: 4.5,
        ionicConductivity: 3e-4,
        source: "Materials Project",
      },
      {
        materialId: "mp-1186600",
        name: "Lithium Thiophosphate",
        formula: "Li6PS5Cl",
        category: "Solid-state",
        spaceGroup: "F-43m",
        energyDensity: 0,
        voltageWindow: 4.8,
        ionicConductivity: 2e-3,
        source: "AFLOW",
      },
      {
        materialId: "sc-001",
        name: "Activated Carbon",
        formula: "C",
        category: "Supercapacitor",
        spaceGroup: "P6/mmm",
        energyDensity: 8,
        voltageWindow: 2.7,
        ionicConductivity: 0.1,
        source: "Experimental",
      },
      {
        materialId: "sc-002",
        name: "Manganese Dioxide",
        formula: "MnO2",
        category: "Supercapacitor",
        spaceGroup: "I4/m",
        energyDensity: 15,
        voltageWindow: 1.0,
        ionicConductivity: 1e-4,
        source: "Experimental",
      },
      {
        materialId: "fb-001",
        name: "Vanadium Pentoxide",
        formula: "V2O5",
        category: "Flow Battery",
        spaceGroup: "Pmmn",
        energyDensity: 25,
        voltageWindow: 1.6,
        ionicConductivity: 1e-2,
        source: "Experimental",
      },
      {
        materialId: "fb-002",
        name: "Zinc Bromide",
        formula: "ZnBr2",
        category: "Flow Battery",
        spaceGroup: "P21/c",
        energyDensity: 65,
        voltageWindow: 1.8,
        ionicConductivity: 0.5,
        source: "Experimental",
      },
    ];

    for (const material of sampleMaterials) {
      const id = randomUUID();
      this.datasetEntries.set(id, { ...material, id });
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMaterial(id: string): Promise<Material | undefined> {
    return this.materials.get(id);
  }

  async getMaterials(): Promise<Material[]> {
    return Array.from(this.materials.values());
  }

  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const id = randomUUID();
    const material: Material = { 
      ...insertMaterial, 
      id,
      createdAt: new Date(),
    };
    this.materials.set(id, material);
    return material;
  }

  async deleteMaterial(id: string): Promise<boolean> {
    return this.materials.delete(id);
  }

  async getPrediction(id: string): Promise<Prediction | undefined> {
    return this.predictions.get(id);
  }

  async getPredictionsByMaterial(materialId: string): Promise<Prediction[]> {
    return Array.from(this.predictions.values()).filter(
      (p) => p.materialId === materialId
    );
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const id = randomUUID();
    const prediction: Prediction = {
      ...insertPrediction,
      id,
      createdAt: new Date(),
    };
    this.predictions.set(id, prediction);
    return prediction;
  }

  async getCandidates(): Promise<Candidate[]> {
    return Array.from(this.candidates.values());
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const id = randomUUID();
    const candidate: Candidate = {
      ...insertCandidate,
      id,
      createdAt: new Date(),
    };
    this.candidates.set(id, candidate);
    return candidate;
  }

  async createCandidates(insertCandidates: InsertCandidate[]): Promise<Candidate[]> {
    const candidates: Candidate[] = [];
    for (const insertCandidate of insertCandidates) {
      const candidate = await this.createCandidate(insertCandidate);
      candidates.push(candidate);
    }
    return candidates;
  }

  async getDatasetEntries(params?: { 
    page?: number; 
    limit?: number; 
    category?: string;
    search?: string;
  }): Promise<{ entries: DatasetEntry[]; total: number }> {
    let entries = Array.from(this.datasetEntries.values());
    
    if (params?.category) {
      entries = entries.filter(e => e.category === params.category);
    }
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      entries = entries.filter(e => 
        e.name.toLowerCase().includes(search) ||
        e.formula.toLowerCase().includes(search)
      );
    }
    
    const total = entries.length;
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    
    entries = entries.slice(start, start + limit);
    
    return { entries, total };
  }

  async getDatasetEntry(id: string): Promise<DatasetEntry | undefined> {
    return this.datasetEntries.get(id);
  }

  async createDatasetEntry(insertEntry: InsertDatasetEntry): Promise<DatasetEntry> {
    const id = randomUUID();
    const entry: DatasetEntry = { ...insertEntry, id };
    this.datasetEntries.set(id, entry);
    return entry;
  }
}

export const storage = new MemStorage();

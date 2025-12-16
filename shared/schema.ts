import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Materials table - stores uploaded materials
export const materials = pgTable("materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  formula: text("formula"),
  format: text("format").notNull(), // CIF, POSCAR, SMILES, JSON
  rawData: text("raw_data").notNull(),
  atomicPositions: jsonb("atomic_positions"),
  latticeParameters: jsonb("lattice_parameters"),
  spaceGroup: text("space_group"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMaterialSchema = createInsertSchema(materials).omit({
  id: true,
  createdAt: true,
});

export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Material = typeof materials.$inferSelect;

// Predictions table - stores prediction results
export const predictions = pgTable("predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  materialId: varchar("material_id").notNull(),
  energyDensity: real("energy_density"),
  voltageWindow: real("voltage_window"),
  ionicConductivity: real("ionic_conductivity"),
  thermalStability: real("thermal_stability"),
  cycleLife: integer("cycle_life"),
  uncertainty: jsonb("uncertainty"),
  descriptors: jsonb("descriptors"),
  physicsValidation: jsonb("physics_validation"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
});

export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictions.$inferSelect;

// Candidates table - stores generated candidate materials
export const candidates = pgTable("candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  parentMaterialId: varchar("parent_material_id"),
  formula: text("formula").notNull(),
  structure: jsonb("structure"),
  predictedProperties: jsonb("predicted_properties"),
  score: real("score"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
  createdAt: true,
});

export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;

// Dataset entries - pre-loaded materials dataset
export const datasetEntries = pgTable("dataset_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  materialId: text("material_id").notNull(),
  name: text("name").notNull(),
  formula: text("formula").notNull(),
  category: text("category"),
  spaceGroup: text("space_group"),
  energyDensity: real("energy_density"),
  voltageWindow: real("voltage_window"),
  ionicConductivity: real("ionic_conductivity"),
  source: text("source"),
});

export const insertDatasetEntrySchema = createInsertSchema(datasetEntries).omit({
  id: true,
});

export type InsertDatasetEntry = z.infer<typeof insertDatasetEntrySchema>;
export type DatasetEntry = typeof datasetEntries.$inferSelect;

// Frontend-specific types for API responses
export interface PredictionResult {
  materialId: string;
  materialName: string;
  energyDensity: number;
  voltageWindow: number;
  ionicConductivity: number;
  thermalStability: number;
  cycleLife: number;
  uncertainty: {
    energyDensity: number;
    voltageWindow: number;
    ionicConductivity: number;
    thermalStability: number;
    cycleLife: number;
  };
  descriptors: {
    bandGap: number;
    formationEnergy: number;
    ionicRadius: number;
    electronegativity: number;
    density: number;
  };
  physicsValidation: {
    chargeNeutrality: boolean;
    energyConservation: boolean;
    thermodynamicStability: boolean;
    structuralIntegrity: boolean;
  };
}

export interface MolecularStructure {
  atoms: {
    element: string;
    position: [number, number, number];
    color: string;
  }[];
  bonds: {
    start: number;
    end: number;
    order: number;
  }[];
  lattice?: {
    a: number;
    b: number;
    c: number;
    alpha: number;
    beta: number;
    gamma: number;
  };
}

export interface CandidateGenerationRequest {
  baseFormula?: string;
  targetEnergyDensity?: number;
  targetVoltage?: number;
  constraints?: {
    elements?: string[];
    excludeElements?: string[];
    maxAtoms?: number;
    spaceGroups?: string[];
  };
  count?: number;
}

export interface DatasetQueryParams {
  search?: string;
  category?: string;
  minEnergyDensity?: number;
  maxEnergyDensity?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

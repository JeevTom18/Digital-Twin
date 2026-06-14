export enum UserRole {
  Policymaker = 'Government User',
  Public = 'Public User',
}

export interface PolicyParameters {
  budgetAllocation: number; // in Cr
  targetCoverage: number; // in %
  implementationTimeline: string; // e.g., "1 year"
  geographicScope: string; // e.g., "National"
}

export interface FineTuningParameters {
  economicModel: 'Optimistic' | 'Neutral' | 'Pessimistic';
  socialAdoptionRate: number; // %
  climateImpact: number; // 0-100 scale
  marketVolatility: number; // 0-100 scale
  blackSwanEvents: boolean;
}

export interface SimulationInput {
  policyName: string;
  policyType: string;
  policyDescription: string;
  parameters: PolicyParameters;
  fineTuning?: FineTuningParameters;
}

// Generic Data Point Types for Charts
export interface LineChartDataPoint { year: number; value: number; }
export interface BarChartDataPoint { category: string; value: number; }
export interface WellBeingData { state: string; impactScore: number; }

export interface MultiLineChartDataPoint {
  year: number;
  [key: string]: number;
}

export interface LineConfig {
  dataKey: string;
  name: string;
  color: string;
}

export type MetricType = 'line-chart' | 'bar-chart' | 'heatmap';

export interface Metric {
    title: string;
    type: MetricType;
    data: (LineChartDataPoint | BarChartDataPoint | WellBeingData | MultiLineChartDataPoint)[];
    unit?: string;
    description?: string;
    lines?: LineConfig[];
    color?: string;
}

export interface SimulationResult {
  economicImpact: number; // % change
  socialImpact: number; // score /10
  environmentalImpact: number; // % change
  confidence: number; // %
  summary: string; // text summary
  detailedMetrics: Metric[];
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  status: 'draft' | 'completed' | 'running';
  inputs: SimulationInput;
  results?: SimulationResult;
}

// Types for Stakeholder Reports Page
export interface SensitivityFactor {
  name: string;
  value: number;
  color: string;
}

export interface StakeholderData {
  id: string;
  name: string;
  population: string;
  policyImpacts: {
    policyName: string;
    impactScore: number;
    summary: string;
  };
  sensitivityFactors: SensitivityFactor[];
}

// Types for Public Pages
export interface PredefinedScenario {
  id: string;
  title: string;
  description: string;
  results: SimulationResult;
}

export interface PolicyScenarioCategory {
  policyType: string;
  description: string;
  scenarios: PredefinedScenario[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

// Types for Scenario Comparison
export interface SimulationSnapshot {
  id: string;
  entryId: string;
  timestamp: string;
  inputs: SimulationInput;
  results?: SimulationResult;
  isSelected: boolean;
}
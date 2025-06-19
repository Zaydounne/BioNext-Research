export interface User {
  email: string;
  name: string;
  role: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'genetic' | 'therapeutic' | 'cellular' | 'biochemical';
  status: 'completed' | 'in-progress' | 'pending';
  completionDate: string;
  sampleSize: number;
}

export interface AnalysisResult {
  summary: string;
  keyFindings: string[];
  statisticalSignificance: number;
  confidenceLevel: number;
  methodology: string;
  limitations: string[];
}

export interface ChartData {
  type: 'bar' | 'pie' | 'line' | 'scatter';
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
}

export interface Report {
  project: Project;
  analysis: AnalysisResult;
  charts: ChartData[];
  generatedAt: string;
}
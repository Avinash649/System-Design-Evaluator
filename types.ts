
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface Evaluation {
  score: number;
  feedback: string;
}

export interface DesignData {
  problem: string;
  requirements: string;
  architecture: string;
  decisions: string;
}

export interface Design extends DesignData {
  id: string;
  title: string;
  evaluation: Evaluation | null;
  createdAt: string;
}

export enum View {
  AUTH,
  DASHBOARD,
  WIZARD,
}

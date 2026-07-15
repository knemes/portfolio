export interface Point {
  x: number;
  y: number;
}

export interface Line {
  id: string;
  points: Point[];
  color: string;
  size: number;
  tool: 'pen' | 'marker' | 'chisel' | 'eraser';
}

export type PenType = 'pen' | 'marker' | 'chisel' | 'eraser';

export interface PenConfig {
  type: PenType;
  color: string;
  size: number;
  label: string;
  className: string;
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  category: string;
  period: string;
  summary: string;
  tags: string[];
}

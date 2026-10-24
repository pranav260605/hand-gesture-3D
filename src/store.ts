import { create } from 'zustand';

export type ShapeType = 'box' | 'cylinder' | 'cone' | 'sphere';

export interface ShapeData {
  id: string;
  type: ShapeType;
  position: [number, number, number];
  scale: number;
  color: string;
}

interface AppState {
  shapes: ShapeData[];
  handLandmarks: any[]; 
  setHandLandmarks: (landmarks: any[]) => void;
  addShape: (shape: ShapeData) => void;
  updateShape: (id: string, updates: Partial<ShapeData>) => void;
  removeShape: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  shapes: [],
  handLandmarks: [],
  setHandLandmarks: (landmarks) => set({ handLandmarks: landmarks }),
  addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
  updateShape: (id, updates) => set((state) => ({
    shapes: state.shapes.map((s) => (s.id === id ? { ...s, ...updates } : s)),
  })),
  removeShape: (id) => set((state) => ({
    shapes: state.shapes.filter((s) => s.id !== id),
  })),
}));
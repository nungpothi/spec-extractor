import { create } from 'zustand';
import type { SpecSummary, SpecDetail } from '../types';
import { SpecService } from '../services';

interface SpecState {
  // State
  specs: SpecSummary[];
  currentSpec: SpecDetail | null;
  previewHtml: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSpecs: () => Promise<void>;
  loadSpec: (id: string) => Promise<void>;
  createSpec: (jsonData: object) => Promise<string>;
  deleteSpec: (id: string) => Promise<void>;
  previewJson: (jsonData: object) => Promise<void>;
  clearPreview: () => void;
  clearError: () => void;
}

export const useSpecStore = create<SpecState>((set, get) => ({
  // Initial state
  specs: [],
  currentSpec: null,
  previewHtml: '',
  isLoading: false,
  error: null,

  // Actions
  loadSpecs: async () => {
    set({ isLoading: true, error: null });
    try {
      const specs = await SpecService.getAllSpecs();
      set({ specs, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load specifications',
        isLoading: false 
      });
    }
  },

  loadSpec: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const spec = await SpecService.getSpecById(id);
      set({ currentSpec: spec, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load specification',
        isLoading: false 
      });
    }
  },

  createSpec: async (jsonData: object) => {
    set({ isLoading: true, error: null });
    try {
      const result = await SpecService.createSpec({ json_data: jsonData });
      // Refresh the specs list
      await get().loadSpecs();
      set({ isLoading: false });
      return result.id;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create specification',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteSpec: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await SpecService.deleteSpec(id);
      // Remove from local state
      const specs = get().specs.filter(spec => spec.id !== id);
      set({ specs, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete specification',
        isLoading: false 
      });
    }
  },

  previewJson: async (jsonData: object) => {
    set({ isLoading: true, error: null });
    try {
      const result = await SpecService.previewJson({ json_data: jsonData });
      set({ previewHtml: result.html, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to preview JSON',
        isLoading: false 
      });
    }
  },

  clearPreview: () => {
    set({ previewHtml: '' });
  },

  clearError: () => {
    set({ error: null });
  },
}));
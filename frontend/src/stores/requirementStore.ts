import { create } from 'zustand';
import { RequirementService } from '../services';
import type { RequirementItem, CreateRequirementRequest } from '../types';

interface RequirementState {
  requirements: RequirementItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadRequirements: () => Promise<void>;
  createRequirement: (data: CreateRequirementRequest) => Promise<void>;
  clearError: () => void;
}

export const useRequirementStore = create<RequirementState>((set, get) => ({
  requirements: [],
  isLoading: false,
  error: null,

  loadRequirements: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const requirements = await RequirementService.getAllRequirements();
      set({ requirements, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load requirements',
        isLoading: false 
      });
    }
  },

  createRequirement: async (data: CreateRequirementRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      await RequirementService.createRequirement(data);
      
      // Reload requirements after successful creation
      await get().loadRequirements();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create requirement',
        isLoading: false 
      });
      throw error; // Re-throw to handle in component
    }
  },

  clearError: () => set({ error: null }),
}));
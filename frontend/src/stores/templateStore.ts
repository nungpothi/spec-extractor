import { create } from 'zustand';
import { Template, CreateTemplateRequest, UpdateTemplateRequest, TemplateListItem } from '@/types/template';
import { TemplateService } from '@/services/templateService';

interface TemplateState {
  templates: TemplateListItem[];
  currentTemplate: Template | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTemplates: () => Promise<void>;
  fetchTemplateById: (id: string) => Promise<void>;
  createTemplate: (data: CreateTemplateRequest) => Promise<string>;
  updateTemplate: (id: string, data: UpdateTemplateRequest) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentTemplate: () => void;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  currentTemplate: null,
  loading: false,
  error: null,

  fetchTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const templates = await TemplateService.getAll();
      set({ templates, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch templates',
        loading: false 
      });
    }
  },

  fetchTemplateById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const template = await TemplateService.getById(id);
      set({ currentTemplate: template, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch template',
        loading: false 
      });
    }
  },

  createTemplate: async (data: CreateTemplateRequest) => {
    set({ loading: true, error: null });
    try {
      const result = await TemplateService.create(data);
      set({ loading: false });
      // Refresh the templates list
      await get().fetchTemplates();
      return result.id;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create template',
        loading: false 
      });
      throw error;
    }
  },

  updateTemplate: async (id: string, data: UpdateTemplateRequest) => {
    set({ loading: true, error: null });
    try {
      await TemplateService.update(id, data);
      set({ loading: false });
      // Refresh the templates list
      await get().fetchTemplates();
      // If we're viewing this template, refresh it too
      if (get().currentTemplate?.id === id) {
        await get().fetchTemplateById(id);
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update template',
        loading: false 
      });
      throw error;
    }
  },

  deleteTemplate: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await TemplateService.delete(id);
      set({ loading: false });
      // Refresh the templates list
      await get().fetchTemplates();
      // Clear current template if it was deleted
      if (get().currentTemplate?.id === id) {
        set({ currentTemplate: null });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete template',
        loading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  
  clearCurrentTemplate: () => set({ currentTemplate: null }),
}));
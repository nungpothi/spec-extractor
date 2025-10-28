import { create } from 'zustand';
import type {
  QuotationSummary,
  QuotationDetail,
  CreateQuotationRequest,
  UpdateQuotationRequest,
} from '../types';
import { QuotationService } from '../services';

interface QuotationState {
  quotations: QuotationSummary[];
  currentQuotation: QuotationDetail | null;
  shareLink: string | null;
  isListing: boolean;
  isSaving: boolean;
  isFetchingDetail: boolean;
  isPdfLoading: boolean;
  isShareLoading: boolean;
  error: string | null;
  loadQuotations: () => Promise<void>;
  fetchQuotation: (id: string) => Promise<void>;
  createQuotation: (data: CreateQuotationRequest) => Promise<string>;
  updateQuotation: (id: string, data: UpdateQuotationRequest) => Promise<void>;
  downloadQuotationPdf: (id: string) => Promise<Blob>;
  generateShareLink: (id: string) => Promise<string>;
  clearShareLink: () => void;
  clearError: () => void;
  setCurrentQuotation: (quotation: QuotationDetail | null) => void;
}

export const useQuotationStore = create<QuotationState>((set, get) => ({
  quotations: [],
  currentQuotation: null,
  shareLink: null,
  isListing: false,
  isSaving: false,
  isFetchingDetail: false,
  isPdfLoading: false,
  isShareLoading: false,
  error: null,

  loadQuotations: async () => {
    set({ isListing: true, error: null });
    try {
      const quotations = await QuotationService.list();
      set({ quotations, isListing: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load quotations',
        isListing: false,
      });
    }
  },

  fetchQuotation: async (id: string) => {
    set({ isFetchingDetail: true, error: null });
    try {
      const quotation = await QuotationService.getById(id);
      set({ currentQuotation: quotation, isFetchingDetail: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load quotation details',
        isFetchingDetail: false,
      });
    }
  },

  createQuotation: async (data: CreateQuotationRequest) => {
    set({ isSaving: true, error: null });
    try {
      const result = await QuotationService.create(data);
      await get().loadQuotations();
      set({ isSaving: false });
      return result.id;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create quotation',
        isSaving: false,
      });
      throw error;
    }
  },

  updateQuotation: async (id: string, data: UpdateQuotationRequest) => {
    set({ isSaving: true, error: null });
    try {
      await QuotationService.update(id, data);
      await get().loadQuotations();
      set({ isSaving: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update quotation',
        isSaving: false,
      });
      throw error;
    }
  },

  downloadQuotationPdf: async (id: string) => {
    set({ isPdfLoading: true, error: null });
    try {
      const blob = await QuotationService.downloadPdf(id);
      set({ isPdfLoading: false });
      return blob;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to download PDF',
        isPdfLoading: false,
      });
      throw error;
    }
  },

  generateShareLink: async (id: string) => {
    set({ isShareLoading: true, error: null });
    try {
      const { publicUrl } = await QuotationService.getShareLink(id);
      set({ shareLink: publicUrl, isShareLoading: false });
      return publicUrl;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to generate share link',
        isShareLoading: false,
      });
      throw error;
    }
  },

  clearShareLink: () => {
    set({ shareLink: null });
  },

  clearError: () => {
    set({ error: null });
  },

  setCurrentQuotation: (quotation: QuotationDetail | null) => {
    set({ currentQuotation: quotation });
  },
}));

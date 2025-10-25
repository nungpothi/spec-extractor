import { create } from 'zustand';
import { KioskState, KioskActions } from '../types';

type KioskStore = KioskState & KioskActions;

const createInitialState = (): KioskState => ({
  currentStep: 'welcome',
  loading: false,
  error: null,
  checkInData: null,
  registrationData: null,
  availableSlots: [],
  products: [],
  customer: {
    name: '',
    phone: '',
    identifier: '',
  },
  selectedCategory: null,
  selectedProduct: null,
  selectedDate: '',
  selectedTime: '',
});

export const useKioskStore = create<KioskStore>((set) => ({
  ...createInitialState(),

  setCurrentStep: (step) => set({ currentStep: step }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCheckInData: (data) => set({ checkInData: data }),
  setRegistrationData: (data) => set({ registrationData: data }),
  setAvailableSlots: (slots) => set({ availableSlots: slots }),
  setProducts: (catalog) => set({ products: catalog }),
  setCustomer: (customer) => set((state) => ({
    customer: {
      ...state.customer,
      ...customer,
    },
  })),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTime: (time) => set({ selectedTime: time }),

  reset: () => set(createInitialState()),
}));

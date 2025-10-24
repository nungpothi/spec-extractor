import { create } from 'zustand';
import { KioskState, KioskActions } from '../types';

type KioskStore = KioskState & KioskActions;

const initialState: KioskState = {
  currentStep: 'welcome',
  loading: false,
  error: null,
  checkInData: null,
  registrationData: null,
  availableSlots: [],
  selectedDate: '',
  selectedTime: '',
};

export const useKioskStore = create<KioskStore>((set) => ({
  ...initialState,
  
  setCurrentStep: (step) => set({ currentStep: step }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCheckInData: (data) => set({ checkInData: data }),
  setRegistrationData: (data) => set({ registrationData: data }),
  setAvailableSlots: (slots) => set({ availableSlots: slots }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTime: (time) => set({ selectedTime: time }),
  
  reset: () => set(initialState),
}));
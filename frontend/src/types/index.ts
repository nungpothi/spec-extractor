// API Types
export interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  results: T;
}

// Check-in Types
export interface CheckInRequest {
  identifier: string;
}

export interface CheckInResponse {
  name: string;
  product_name: string;
  appointment_date: string;
  appointment_time: string;
  queue_no: string;
}

// Product Catalog Types
export interface ProductItem {
  id: string;
  name: string;
  require_booking: boolean;
}

export interface ProductCategory {
  category: string;
  items: ProductItem[];
}

// Registration Types
export interface RegisterRequest {
  name: string;
  phone: string;
  product_id: string;
  appointment_date?: string;
  appointment_time?: string;
}

export interface RegisterResponse {
  queue_no: string;
  appointment_date: string;
  appointment_time: string;
  product_name: string;
}

// Available Slots Types
export interface TimeSlot {
  date: string;
  time: string[];
}

// Print Queue Types
export interface PrintQueueRequest {
  queue_no: string;
}

export interface PrintQueueResponse {
  queue_no: string;
  printer_status: string;
}

// UI State Types
export interface CustomerDetails {
  name: string;
  phone: string;
  identifier: string;
}

export interface KioskState {
  currentStep: 'welcome' | 'checkin' | 'register' | 'appointment' | 'confirmation' | 'print';
  loading: boolean;
  error: string | null;
  checkInData: CheckInResponse | null;
  registrationData: RegisterResponse | null;
  availableSlots: TimeSlot[];
  products: ProductCategory[];
  customer: CustomerDetails;
  selectedCategory: string | null;
  selectedProduct: ProductItem | null;
  selectedDate: string;
  selectedTime: string;
}

export interface KioskActions {
  setCurrentStep: (step: KioskState['currentStep']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCheckInData: (data: CheckInResponse | null) => void;
  setRegistrationData: (data: RegisterResponse | null) => void;
  setAvailableSlots: (slots: TimeSlot[]) => void;
  setProducts: (catalog: ProductCategory[]) => void;
  setCustomer: (customer: Partial<CustomerDetails>) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedProduct: (product: ProductItem | null) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  reset: () => void;
}

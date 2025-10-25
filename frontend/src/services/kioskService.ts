import {
  ApiResponse,
  CheckInRequest,
  CheckInResponse,
  RegisterRequest,
  RegisterResponse,
  TimeSlot,
  PrintQueueRequest,
  PrintQueueResponse,
  ProductCategory,
  ProductItem,
} from '../types';

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PRODUCT_CATALOG: ProductCategory[] = [
  {
    category: 'Skincare',
    items: [
      { id: 'SK001', name: 'Facial Treatment', require_booking: true },
      { id: 'SK002', name: 'Hydration Boost', require_booking: false },
    ],
  },
  {
    category: 'Hair Styling',
    items: [
      { id: 'HS001', name: 'Hair Coloring', require_booking: true },
      { id: 'HS002', name: 'Hair Wash & Blow Dry', require_booking: false },
    ],
  },
  {
    category: 'Nail & Spa',
    items: [
      { id: 'NS001', name: 'Aromatherapy Massage', require_booking: true },
      { id: 'NS002', name: 'Manicure & Pedicure', require_booking: false },
    ],
  },
  {
    category: 'Makeup',
    items: [
      { id: 'MU001', name: 'Bridal Makeup', require_booking: true },
      { id: 'MU002', name: 'Casual Makeup', require_booking: false },
    ],
  },
  {
    category: 'Body Treatment',
    items: [
      { id: 'BT001', name: 'Slimming Wrap', require_booking: true },
      { id: 'BT002', name: 'Foot Reflexology', require_booking: false },
    ],
  },
];

const AVAILABLE_SLOTS: TimeSlot[] = [
  { date: '2025-10-27', time: ['09:00', '10:00', '14:00', '15:00'] },
  { date: '2025-10-28', time: ['09:00', '11:00', '13:00'] },
];

const findProduct = (productId: string): ProductItem | undefined =>
  PRODUCT_CATALOG.flatMap((category) => category.items).find((item) => item.id === productId);

export class KioskService {
  async checkIn(request: CheckInRequest): Promise<ApiResponse<CheckInResponse | null>> {
    await delay(800);

    const identifier = request.identifier.trim();
    if (identifier === '0812345678') {
      const product = findProduct('NS002');
      return {
        status: true,
        message: 'found',
        results: {
          name: 'Somchai Rakdee',
          product_name: product?.name ?? 'Preferred Service',
          appointment_date: '2025-10-27',
          appointment_time: '14:00',
          queue_no: 'B045',
        },
      };
    }

    return {
      status: false,
      message: 'not found',
      results: null,
    };
  }

  async getProducts(): Promise<ApiResponse<ProductCategory[]>> {
    await delay(500);

    return {
      status: true,
      message: 'product categories loaded',
      results: PRODUCT_CATALOG,
    };
  }

  async register(request: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    await delay(1000);

    const product = findProduct(request.product_id);
    const requiresBooking = product?.require_booking ?? false;
    const fallbackSlot = AVAILABLE_SLOTS[0];
    const appointmentDate = requiresBooking
      ? request.appointment_date ?? fallbackSlot.date
      : new Date().toISOString().split('T')[0];
    const appointmentTime = requiresBooking
      ? request.appointment_time ?? fallbackSlot.time[0]
      : 'Walk-in';

    return {
      status: true,
      message: 'registered',
      results: {
        queue_no: requiresBooking ? 'B045' : 'W108',
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        product_name: product?.name ?? 'Selected Service',
      },
    };
  }

  async getAvailableSlots(): Promise<ApiResponse<TimeSlot[]>> {
    await delay(600);

    return {
      status: true,
      message: 'available slots loaded',
      results: AVAILABLE_SLOTS,
    };
  }

  async printQueue(request: PrintQueueRequest): Promise<ApiResponse<PrintQueueResponse>> {
    await delay(1200);

    return {
      status: true,
      message: 'queue printed successfully',
      results: {
        queue_no: request.queue_no,
        printer_status: 'ok',
      },
    };
  }
}

export const kioskService = new KioskService();

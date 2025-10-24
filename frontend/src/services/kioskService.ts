import {
  ApiResponse,
  CheckInRequest,
  CheckInResponse,
  RegisterRequest,
  RegisterResponse,
  TimeSlot,
  PrintQueueRequest,
  PrintQueueResponse,
} from '../types';

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class KioskService {
  
  async checkIn(_request: CheckInRequest): Promise<ApiResponse<CheckInResponse>> {
    await delay(1000); // Simulate API call delay
    
    // Mock API response based on specification
    return {
      status: true,
      message: "found",
      results: {
        name: "Somchai Rakdee",
        appointment_date: "2025-10-26",
        appointment_time: "10:30",
        queue_no: "A012"
      }
    };
  }

  async register(request: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    await delay(1500); // Simulate API call delay
    
    // Mock API response based on specification
    return {
      status: true,
      message: "registered",
      results: {
        queue_no: "B045",
        appointment_date: request.appointment_date,
        appointment_time: request.appointment_time
      }
    };
  }

  async getAvailableSlots(): Promise<ApiResponse<TimeSlot[]>> {
    await delay(800); // Simulate API call delay
    
    // Mock API response based on specification
    return {
      status: true,
      message: "available slots loaded",
      results: [
        { date: "2025-10-27", time: ["09:00", "10:00", "14:00", "15:00"] },
        { date: "2025-10-28", time: ["09:00", "11:00", "13:00"] }
      ]
    };
  }

  async printQueue(request: PrintQueueRequest): Promise<ApiResponse<PrintQueueResponse>> {
    await delay(2000); // Simulate printing delay
    
    // Mock API response based on specification
    return {
      status: true,
      message: "queue printed successfully",
      results: {
        queue_no: request.queue_no,
        printer_status: "ok"
      }
    };
  }
}

export const kioskService = new KioskService();
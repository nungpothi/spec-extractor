import { IUserRepository } from '../../domain/repositories';

export interface GetCurrentUserRequest {
  userId: string;
}

export interface GetCurrentUserResponse {
  id: string;
  email: string;
  phone: string;
  role: string;
}

export class GetCurrentUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: GetCurrentUserRequest): Promise<GetCurrentUserResponse> {
    const { userId } = request;

    // Validate input
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Find user by ID
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
  }
}
import { IUserRepository } from '../../domain/repositories';
import { User } from '../../domain/entities';

export interface RegisterUserRequest {
  phone: string;
  email: string;
  password: string;
}

export interface RegisterUserResponse {
  id: string;
}

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    const { phone, email, password } = request;

    // Validate input
    if (!phone || !email || !password) {
      throw new Error('Phone, email, and password are required');
    }

    // Check if user already exists
    const existingUserByEmail = await this.userRepository.existsByEmail(email);
    if (existingUserByEmail) {
      throw new Error('User with this email already exists');
    }

    const existingUserByPhone = await this.userRepository.existsByPhone(phone);
    if (existingUserByPhone) {
      throw new Error('User with this phone number already exists');
    }

    // Create user
    const user = await User.create(phone, email, password, 'VISITOR');

    // Validate user
    if (!user.isValid()) {
      throw new Error('Invalid user data');
    }

    // Save user
    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
    };
  }
}
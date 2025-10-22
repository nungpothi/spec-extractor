import { IUserRepository } from '../../domain/repositories';
import { JwtService, JwtPayload } from '../../infrastructure/auth';

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  token: string;
  role: string;
}

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    const { email, password } = request;

    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
    };

    const token = JwtService.generateToken(payload);

    return {
      token,
      role: user.role,
    };
  }
}
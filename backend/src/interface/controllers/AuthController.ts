import { Request, Response } from 'express';
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  GetCurrentUserUseCase,
} from '../../usecases/auth';
import {
  RegisterRequestDto,
  LoginRequestDto,
} from '../../usecases/dto';
import { UserRepository } from '../../infrastructure/repositories';

export class AuthController {
  private registerUserUseCase: RegisterUserUseCase;
  private loginUserUseCase: LoginUserUseCase;
  private getCurrentUserUseCase: GetCurrentUserUseCase;

  constructor() {
    const userRepository = new UserRepository();
    this.registerUserUseCase = new RegisterUserUseCase(userRepository);
    this.loginUserUseCase = new LoginUserUseCase(userRepository);
    this.getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone, email, password }: RegisterRequestDto = req.body;

      const result = await this.registerUserUseCase.execute({
        phone,
        email,
        password,
      });

      res.status(201).json({
        status: true,
        message: 'registered',
        results: [result],
        errors: [],
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json({
        status: false,
        message: 'registration_failed',
        results: [],
        errors: [errorMessage],
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password }: LoginRequestDto = req.body;

      const result = await this.loginUserUseCase.execute({
        email,
        password,
      });

      res.status(200).json({
        status: true,
        message: 'logged_in',
        results: [result],
        errors: [],
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json({
        status: false,
        message: 'login_failed',
        results: [],
        errors: [errorMessage],
      });
    }
  };

  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: false,
          message: 'unauthorized',
          results: [],
          errors: ['User not authenticated'],
        });
        return;
      }

      const result = await this.getCurrentUserUseCase.execute({
        userId: req.user.userId,
      });

      res.status(200).json({
        status: true,
        message: 'success',
        results: [result],
        errors: [],
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get user';
      res.status(404).json({
        status: false,
        message: 'user_not_found',
        results: [],
        errors: [errorMessage],
      });
    }
  };
}
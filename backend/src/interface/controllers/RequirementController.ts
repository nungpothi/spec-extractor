import { Request, Response } from 'express';
import {
  CreateRequirementUseCase,
  GetAllRequirementsUseCase,
} from '../../usecases/requirements';
import {
  CreateRequirementRequestDto,
} from '../../usecases/dto';
import { RequirementRepository } from '../../infrastructure/repositories';
import { RequirementStatus } from '../../domain/entities';

export class RequirementController {
  private createRequirementUseCase: CreateRequirementUseCase;
  private getAllRequirementsUseCase: GetAllRequirementsUseCase;

  constructor() {
    const requirementRepository = new RequirementRepository();
    this.createRequirementUseCase = new CreateRequirementUseCase(requirementRepository);
    this.getAllRequirementsUseCase = new GetAllRequirementsUseCase(requirementRepository);
  }

  createRequirement = async (req: Request, res: Response): Promise<void> => {
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

      const { content, is_private, status }: CreateRequirementRequestDto = req.body;

      const result = await this.createRequirementUseCase.execute({
        content,
        isPrivate: is_private,
        status: (status || 'NEW') as RequirementStatus,
        userId: req.user.userId,
      });

      res.status(201).json({
        status: true,
        message: 'saved',
        results: [result],
        errors: [],
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create requirement';
      res.status(400).json({
        status: false,
        message: 'creation_failed',
        results: [],
        errors: [errorMessage],
      });
    }
  };

  getAllRequirements = async (req: Request, res: Response): Promise<void> => {
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

      const result = await this.getAllRequirementsUseCase.execute({
        userId: req.user.userId,
        userRole: req.user.role,
      });

      res.status(200).json({
        status: true,
        message: 'success',
        results: result,
        errors: [],
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get requirements';
      const statusCode = errorMessage.includes('Access denied') ? 403 : 500;
      
      res.status(statusCode).json({
        status: false,
        message: 'fetch_failed',
        results: [],
        errors: [errorMessage],
      });
    }
  };
}
import { Request, Response } from 'express';
import {
  CreateRequirementUseCase,
  GetAllRequirementsUseCase,
  UpdateRequirementUseCase,
} from '../../usecases/requirements';
import {
  CreateRequirementRequestDto,
  UpdateRequirementRequestDto,
} from '../../usecases/dto';
import { RequirementRepository } from '../../infrastructure/repositories';
import { RequirementStatus } from '../../domain/entities';

export class RequirementController {
  private createRequirementUseCase: CreateRequirementUseCase;
  private getAllRequirementsUseCase: GetAllRequirementsUseCase;
  private updateRequirementUseCase: UpdateRequirementUseCase;

  constructor() {
    const requirementRepository = new RequirementRepository();
    this.createRequirementUseCase = new CreateRequirementUseCase(requirementRepository);
    this.getAllRequirementsUseCase = new GetAllRequirementsUseCase(requirementRepository);
    this.updateRequirementUseCase = new UpdateRequirementUseCase(requirementRepository);
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

      const { content, is_private }: CreateRequirementRequestDto = req.body;

      const result = await this.createRequirementUseCase.execute({
        content,
        isPrivate: is_private,
        status: 'NEW', // Always default to NEW
        userId: req.user.userId,
      });

      res.status(201).json({
        status: true,
        message: 'saved',
        results: [{ id: result.id, status: 'NEW' }],
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

  updateRequirement = async (req: Request, res: Response): Promise<void> => {
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

      // Only ADMIN users can update requirements
      if (req.user.role !== 'ADMIN') {
        res.status(403).json({
          status: false,
          message: 'access_denied',
          results: [],
          errors: ['Only ADMIN users can update requirements'],
        });
        return;
      }

      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          status: false,
          message: 'invalid_request',
          results: [],
          errors: ['Requirement ID is required'],
        });
        return;
      }

      const { content, is_private, status }: UpdateRequirementRequestDto = req.body;

      const result = await this.updateRequirementUseCase.execute({
        requirementId: id,
        content,
        isPrivate: is_private,
        status: status as RequirementStatus,
        userId: req.user.userId,
      });

      res.status(200).json({
        status: true,
        message: 'updated',
        results: [{ id: result.id }],
        errors: [],
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update requirement';
      const statusCode = errorMessage.includes('Not found') ? 404 : 400;
      
      res.status(statusCode).json({
        status: false,
        message: 'update_failed',
        results: [],
        errors: [errorMessage],
      });
    }
  };
}
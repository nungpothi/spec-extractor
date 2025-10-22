import { IRequirementRepository } from '../../domain/repositories';

export interface GetAllRequirementsRequest {
  userId: string;
  userRole: string;
}

export interface RequirementDto {
  id: string;
  content: string;
  is_private: boolean;
  created_by: string;
  created_at: string;
}

export class GetAllRequirementsUseCase {
  constructor(private requirementRepository: IRequirementRepository) {}

  async execute(request: GetAllRequirementsRequest): Promise<RequirementDto[]> {
    const { userId, userRole } = request;

    // Validate input
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!userRole) {
      throw new Error('User role is required');
    }

    // Only ADMIN users can view all requirements
    if (userRole !== 'ADMIN') {
      throw new Error('Access denied: Admin privileges required');
    }

    // Get all requirements
    const requirements = await this.requirementRepository.findAll();

    // Map to DTOs
    return requirements.map(requirement => ({
      id: requirement.id,
      content: requirement.content,
      is_private: requirement.isPrivate,
      created_by: requirement.createdBy,
      created_at: requirement.createdAt.toISOString(),
    }));
  }
}
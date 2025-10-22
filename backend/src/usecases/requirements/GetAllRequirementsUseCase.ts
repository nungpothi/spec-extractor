import { IRequirementRepository } from '../../domain/repositories';

export interface GetAllRequirementsRequest {
  userId: string;
  userRole: string;
}

export interface RequirementDto {
  id: string;
  content: string;
  is_private: boolean;
  status: string;
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

    let requirements;

    if (userRole === 'ADMIN') {
      // ADMIN users can see all requirements
      requirements = await this.requirementRepository.findAll();
    } else {
      // VISITOR users can see their own requirements and public ones
      requirements = await this.requirementRepository.findByUserOrPublic(userId);
    }

    // Map to DTOs
    return requirements.map(requirement => ({
      id: requirement.id,
      content: requirement.content,
      is_private: requirement.isPrivate,
      status: requirement.status,
      created_by: requirement.createdBy,
      created_at: requirement.createdAt.toISOString(),
    }));
  }
}
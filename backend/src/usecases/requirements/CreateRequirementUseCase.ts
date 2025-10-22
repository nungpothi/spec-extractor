import { IRequirementRepository } from '../../domain/repositories';
import { Requirement } from '../../domain/entities';

export interface CreateRequirementRequest {
  content: string;
  isPrivate: boolean;
  userId: string;
}

export interface CreateRequirementResponse {
  id: string;
}

export class CreateRequirementUseCase {
  constructor(private requirementRepository: IRequirementRepository) {}

  async execute(request: CreateRequirementRequest): Promise<CreateRequirementResponse> {
    const { content, isPrivate, userId } = request;

    // Validate input
    if (!content || !content.trim()) {
      throw new Error('Content is required');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Create requirement
    const requirement = Requirement.create(
      content.trim(),
      isPrivate,
      userId
    );

    // Validate requirement
    if (!requirement.isValid()) {
      throw new Error('Invalid requirement data');
    }

    // Save requirement
    const savedRequirement = await this.requirementRepository.save(requirement);

    return {
      id: savedRequirement.id,
    };
  }
}
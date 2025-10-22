import { IRequirementRepository } from '../../domain/repositories';
import { Requirement, RequirementStatus } from '../../domain/entities';
import { CreateRequirementResponseDto } from '../dto';

interface UpdateRequirementInput {
  requirementId: string;
  content: string;
  isPrivate: boolean;
  status: RequirementStatus;
  userId: string;
}

export class UpdateRequirementUseCase {
  constructor(
    private requirementRepository: IRequirementRepository
  ) {}

  async execute(input: UpdateRequirementInput): Promise<CreateRequirementResponseDto> {
    // Find the existing requirement
    const existingRequirement = await this.requirementRepository.findById(input.requirementId);
    
    if (!existingRequirement) {
      throw new Error('Requirement not found');
    }

    // Create updated requirement entity (preserving original creation data)
    const updatedRequirement = new Requirement(
      existingRequirement.id,
      input.content,
      input.isPrivate,
      input.status,
      existingRequirement.createdBy, // Keep original creator
      existingRequirement.createdAt,
      new Date() // Set updated timestamp
    );

    if (!updatedRequirement.isValid()) {
      throw new Error('Invalid requirement data');
    }

    // Update in repository
    const result = await this.requirementRepository.update(updatedRequirement);

    return {
      id: result.id,
    };
  }
}
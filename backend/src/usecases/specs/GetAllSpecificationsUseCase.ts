import { ISpecificationRepository, Specification } from '../../domain';
import { 
  CreateSpecificationDto, 
  SpecificationSummaryDto, 
  SpecificationDetailDto 
} from '../dto';

export class GetAllSpecificationsUseCase {
  constructor(
    private specificationRepository: ISpecificationRepository,
  ) {}

  async execute(): Promise<SpecificationSummaryDto[]> {
    const specifications = await this.specificationRepository.findAll();
    
    return specifications.map(spec => ({
      id: spec.id,
      summary: spec.summary,
      created_at: spec.createdAt.toISOString(),
    }));
  }
}
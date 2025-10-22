import { ISpecificationRepository } from '../../domain';
import { SpecificationDetailDto } from '../dto';

export class GetSpecificationByIdUseCase {
  constructor(
    private specificationRepository: ISpecificationRepository,
  ) {}

  async execute(id: string): Promise<SpecificationDetailDto | null> {
    const specification = await this.specificationRepository.findById(id);
    
    if (!specification) {
      return null;
    }

    return {
      id: specification.id,
      json_data: specification.jsonData,
      preview_html: specification.previewHtml,
    };
  }
}
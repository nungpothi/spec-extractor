import { ISpecificationRepository, Specification } from '../../domain';
import { CreateSpecificationDto } from '../dto';
import { JsonToHtmlConverterService } from '../preview/JsonToHtmlConverterService';

export class CreateSpecificationUseCase {
  constructor(
    private specificationRepository: ISpecificationRepository,
    private jsonToHtmlConverter: JsonToHtmlConverterService,
  ) {}

  async execute(dto: CreateSpecificationDto): Promise<{ id: string }> {
    // Validate JSON data
    if (!dto.json_data || typeof dto.json_data !== 'object') {
      throw new Error('Invalid JSON data provided');
    }

    // Convert JSON to HTML preview
    const previewHtml = this.jsonToHtmlConverter.convert(dto.json_data);

    // Create domain entity
    const specification = Specification.create(
      dto.json_data,
      previewHtml,
      dto.created_by,
    );

    // Validate domain entity
    if (!specification.isValid()) {
      throw new Error('Invalid specification data');
    }

    // Save to repository
    const savedSpecification = await this.specificationRepository.save(specification);

    return { id: savedSpecification.id };
  }
}
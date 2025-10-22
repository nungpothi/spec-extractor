import { PreviewRequestDto, PreviewResponseDto } from '../dto';
import { JsonToHtmlConverterService } from './JsonToHtmlConverterService';

export class PreviewJsonUseCase {
  constructor(
    private jsonToHtmlConverter: JsonToHtmlConverterService,
  ) {}

  async execute(dto: PreviewRequestDto): Promise<PreviewResponseDto> {
    // Validate JSON data
    if (!dto.json_data || typeof dto.json_data !== 'object') {
      throw new Error('Invalid JSON data provided');
    }

    // Convert JSON to HTML preview
    const html = this.jsonToHtmlConverter.convert(dto.json_data);

    return { html };
  }
}
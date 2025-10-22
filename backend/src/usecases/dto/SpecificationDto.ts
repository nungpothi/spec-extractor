export interface CreateSpecificationDto {
  json_data: object;
  created_by?: string;
}

export interface SpecificationSummaryDto {
  id: string;
  summary: string;
  created_at: string;
}

export interface SpecificationDetailDto {
  id: string;
  json_data: object;
  preview_html: string;
}

export interface PreviewRequestDto {
  json_data: object;
}

export interface PreviewResponseDto {
  html: string;
}
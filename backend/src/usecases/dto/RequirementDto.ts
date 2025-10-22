export interface CreateRequirementRequestDto {
  content: string;
  is_private: boolean;
}

export interface CreateRequirementResponseDto {
  id: string;
}

export interface RequirementItemDto {
  id: string;
  content: string;
  is_private: boolean;
  created_by: string;
  created_at: string;
}
export interface RegisterRequestDto {
  phone: string;
  email: string;
  password: string;
}

export interface RegisterResponseDto {
  id: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  role: string;
}

export interface GetCurrentUserResponseDto {
  id: string;
  email: string;
  phone: string;
  role: string;
}
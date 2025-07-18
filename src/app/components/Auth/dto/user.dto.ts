export type CreateDto<T> = T;
export type UpdateDto<T> = Partial<T>;
export type ResponseDto<T> = T & { id: string };

export interface BaseUserDto {
  name: string;
  sort: number;
  email: string;
  Date: string;
  img: string;
  status: string;
  Groups: string;
  'License Name': string;
  role: string;
  selected: boolean;
}

// User DTOs using generics
export type CreateUserDto = CreateDto<BaseUserDto>;
export type UpdateUserDto = UpdateDto<BaseUserDto>;
export type UserResponseDto = ResponseDto<BaseUserDto>;

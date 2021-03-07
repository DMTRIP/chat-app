import { IsInt, MinLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserSearchQuery {
  @MinLength(1)
  searchText: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  perPage?: number = 20;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 0;
}

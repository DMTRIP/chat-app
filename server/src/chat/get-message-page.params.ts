import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetMessagePageParams {
  @IsNumber()
  @Transform(({ value }) => parseInt(value),
    {})
  page: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  perPage: number;
}

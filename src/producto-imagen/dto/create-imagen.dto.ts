import { IsInt, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateImagenDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  productoId!: number;

  @IsString()
  url!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  orden?: number;
}
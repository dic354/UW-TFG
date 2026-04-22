import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateResenaDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  productoId!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  puntuacion!: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}
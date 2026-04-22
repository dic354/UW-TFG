import {
  IsString, IsNumber, IsDateString,
  IsOptional, IsBoolean, IsInt, Min, Max, MinLength
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDescuentoDto {
  @IsString()
  @MinLength(3)
  codigo!: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  porcentaje!: number;

  @IsDateString()
  fechaInicio!: string;

  @IsDateString()
  fechaFin!: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  usosMaximos?: number;
}
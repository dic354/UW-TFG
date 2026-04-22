import {
  IsString, IsNumber, IsDateString,
  IsOptional, IsBoolean, IsInt, Min, Max
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDescuentoDto {
  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  porcentaje?: number;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  usosMaximos?: number;
}
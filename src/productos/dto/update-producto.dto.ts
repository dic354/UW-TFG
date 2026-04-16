import {
  IsString, IsOptional, IsNumber,
  IsInt, IsBoolean, IsEnum, Min
} from 'class-validator';
import { Type } from 'class-transformer';

enum Talla {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export class UpdateProductoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  precio?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  categoriaId?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @IsOptional()
  @IsEnum(Talla)
  talla?: Talla;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
import {
  IsString, IsOptional, IsNumber,
  IsInt, IsBoolean, IsEnum, Min, MinLength
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

export class CreateProductoDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  precio!: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  categoriaId!: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock!: number;

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
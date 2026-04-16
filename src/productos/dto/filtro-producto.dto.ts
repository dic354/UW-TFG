import { IsOptional, IsString, IsNumber, IsInt, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

enum Talla {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export class FiltroProductoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoriaId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  precioMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  precioMax?: number;

  @IsOptional()
  @IsEnum(Talla)
  talla?: Talla;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pagina?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limite?: number;
}
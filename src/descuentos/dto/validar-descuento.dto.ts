import { IsString } from 'class-validator';

export class ValidarDescuentoDto {
  @IsString()
  codigo!: string;
}
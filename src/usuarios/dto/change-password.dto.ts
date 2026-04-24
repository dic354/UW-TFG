import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  contrasenaActual!: string;

  @IsString()
  @MinLength(8)
  contrasenaNueva!: string;
}
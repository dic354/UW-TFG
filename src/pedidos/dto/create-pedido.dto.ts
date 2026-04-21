import {
    IsString, IsOptional,
    IsEnum, MinLength
} from 'class-validator';
import { MetodoPago } from '@prisma/client';

export class CreatePedidoDto {
    @IsString()
    @MinLength(5)
    direccionEnvio!: string;

    @IsString()
    @MinLength(2)
    ciudadEnvio!: string;

    @IsString()
    @MinLength(5)
    codigoPostalEnvio!: string;

    @IsEnum(MetodoPago)
    metodoPago!: MetodoPago;

    @IsOptional()
    @IsString()
    codigoDescuento?: string;
}

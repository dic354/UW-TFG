import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddCarritoDto {
    @IsInt()
    @Min(1)
    @Type(() => Number)
    productoId!: number;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    cantidad!: number;
}
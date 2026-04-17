import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCarritoDto {
    @IsInt()
    @Min(1)
    @Type(() => Number)
    cantidad!: number;
}


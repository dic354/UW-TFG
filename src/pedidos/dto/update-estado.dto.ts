import { IsEnum } from 'class-validator';

enum EstadoPedido {
  pendiente = 'pendiente',
  procesando = 'procesando',
  enviado = 'enviado',
  entregado = 'entregado',
  cancelado = 'cancelado',
}

export class UpdateEstadoDto {
  @IsEnum(EstadoPedido)
  estado!: EstadoPedido;
}
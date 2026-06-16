export interface ProductoTop {
  nombre: string
  cantidad_vendida: number
  ingresos: number
}

export interface PedidoPorEstado {
  estado_codigo: string
  cantidad: number
}

export interface IngresoFormaPago {
  forma_pago_codigo: string
  total: number
  cantidad: number
}

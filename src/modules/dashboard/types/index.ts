export interface ResumenKpis {
  ventas_hoy: number
  ticket_promedio: number
  pedidos_activos: number
  ventas_mes: number
}

export interface VentaPeriodo {
  periodo: string
  total_ventas: number
  cantidad_pedidos: number
}

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

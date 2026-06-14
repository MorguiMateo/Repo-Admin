export interface VentasPorDia {
  fecha: string
  total: number
}

export interface ProductoVendido {
  nombre: string
  cantidad: number
}

export interface PedidosPorDiaSemana {
  dia: string
  cantidad: number
}

export interface DashboardKpis {
  ingresos: number
  pedidos: number
}

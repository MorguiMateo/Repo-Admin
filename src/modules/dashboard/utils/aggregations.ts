import type { Order } from '../../pedidos/types'
import type {
  DashboardKpis,
  PedidosPorDiaSemana,
  ProductoVendido,
  VentasPorDia,
} from '../types'

function montoTotal(order: Order): number {
  return Number(order.total) || 0
}

function sumarIngresos(orders: Order[]): number {
  return orders.reduce((acc, order) => acc + montoTotal(order), 0)
}

export function ventasPorDia(orders: Order[]): VentasPorDia[] {
  const acumulado = new Map<string, number>()

  for (const order of orders) {
    const fecha = order.created_at.slice(0, 10)
    acumulado.set(fecha, (acumulado.get(fecha) ?? 0) + montoTotal(order))
  }

  return Array.from(acumulado, ([fecha, total]) => ({ fecha, total })).sort((a, b) =>
    a.fecha.localeCompare(b.fecha),
  )
}

export function kpis(orders: Order[]): DashboardKpis {
  return {
    ingresos: sumarIngresos(orders),
    pedidos: orders.length,
  }
}

export function topProductos(orders: Order[], n = 5): ProductoVendido[] {
  const acumulado = new Map<string, number>()

  for (const order of orders) {
    for (const detalle of order.detalles ?? []) {
      acumulado.set(
        detalle.nombre_snapshot,
        (acumulado.get(detalle.nombre_snapshot) ?? 0) + detalle.cantidad,
      )
    }
  }

  return Array.from(acumulado, ([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, n)
}

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const ORDEN_LUN_A_DOM = [1, 2, 3, 4, 5, 6, 0]

export function pedidosPorDiaSemana(orders: Order[]): PedidosPorDiaSemana[] {
  const conteo = new Array(7).fill(0)

  for (const order of orders) {
    conteo[new Date(order.created_at).getDay()]++
  }

  return ORDEN_LUN_A_DOM.map((indice) => ({
    dia: DIAS_SEMANA[indice],
    cantidad: conteo[indice],
  }))
}

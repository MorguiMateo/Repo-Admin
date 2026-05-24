import type { User } from '../../auth/types'

export type OrderStatusCode =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_PREP'
  | 'EN_CAMINO'
  | 'ENTREGADO'
  | 'CANCELADO'

export interface PaymentMethod {
  codigo: string
  descripcion: string
  habilitado: boolean
}

// precio y nombre son snapshots inmutables del momento de la compra
export interface OrderDetail {
  pedido_id: number
  producto_id: number
  cantidad: number
  nombre_snapshot: string  // nombre del producto al momento de la compra, nunca cambia
  precio_snapshot: number  // precio al momento de la compra, nunca cambia
  subtotal_snap: number
  personalizacion: number[] // IDs de ingredientes removidos por el cliente
  created_at: string
}

// append-only: el backend solo hace INSERTs, nunca UPDATE/DELETE
export interface OrderStatusHistory {
  id: number
  pedido_id: number
  estado_desde: OrderStatusCode | null // null si es la transición inicial
  estado_hacia: OrderStatusCode
  usuario_id: number | null
  motivo: string | null
  created_at: string
}

export interface Order {
  id: number
  usuario_id: number
  direccion_id: number | null
  estado_codigo: OrderStatusCode
  forma_pago_codigo: string
  subtotal: number
  descuento: number
  costo_envio: number
  total: number
  notas: string | null
  created_at: string
  updated_at: string
  // el backend incluye al traer el detalle
  usuario?: Pick<User, 'id' | 'nombre' | 'apellido' | 'email'>
  detalles?: OrderDetail[]
  historial?: OrderStatusHistory[]
}

// body del request para avanzar el estado
export interface AdvanceStatusForm {
  estado_hacia: OrderStatusCode
  motivo?: string
}

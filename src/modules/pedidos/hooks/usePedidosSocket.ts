import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../../store/authStore'
import { API_BASE_URL } from '../../../api/axiosInstance'

// Deriva el WS de la misma base que el axios: http(s)://.../api/v1 → ws(s)://.../api/v1/pedidos/ws
const WS_URL = API_BASE_URL.replace(/^http/, 'ws') + '/pedidos/ws'

const TRACKED_EVENTS = ['ORDER_CREATED', 'ORDER_STATE_CHANGED']

interface PedidoEvent {
  event?: string
  pedido_id?: number
}

// Una sola conexión WebSocket para todo el panel: cada evento de pedido invalida
// las queries de React Query, refrescando Kanban, Cocina y el detalle en vivo.
// La cookie httpOnly viaja en el handshake; solo conectamos para gestores (ADMIN/PEDIDOS).
export function usePedidosSocket() {
  const queryClient = useQueryClient()
  const canManage = useAuthStore((s) => s.hasRole(['ADMIN', 'PEDIDOS']))

  useEffect(() => {
    if (!canManage) return

    const ws = new WebSocket(WS_URL)

    ws.onmessage = (event) => {
      let msg: PedidoEvent
      try {
        msg = JSON.parse(event.data)
      } catch {
        return
      }
      if (!msg.event || !TRACKED_EVENTS.includes(msg.event)) return
      // 'pedidos' (match parcial) cubre Kanban y Cocina; 'pedido' cubre el detalle.
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      if (msg.pedido_id != null) {
        queryClient.invalidateQueries({ queryKey: ['pedido', msg.pedido_id] })
      }
    }

    return () => {
      ws.close()
    }
  }, [canManage, queryClient])
}

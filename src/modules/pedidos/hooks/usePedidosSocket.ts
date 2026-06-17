import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../../store/authStore'
import { API_BASE_URL } from '../../../api/axiosInstance'

//armamos la url del websocket a partir de la misma base del axios, cambiando http por ws
const WS_URL = API_BASE_URL.replace(/^http/, 'ws') + '/pedidos/ws'

const TRACKED_EVENTS = ['ORDER_CREATED', 'ORDER_STATE_CHANGED']

interface PedidoEvent {
  event?: string
  pedido_id?: number
}

//una sola conexion websocket para todo el panel: cada evento de pedido invalida las queries
//y refresca el kanban, cocina y el detalle en vivo. la cookie viaja en el handshake
//solo nos conectamos si es gestor (ADMIN o PEDIDOS)
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
      //'pedidos' cubre el kanban y cocina, 'pedido' cubre el detalle
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

import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { usePedidosSocket } from '../modules/pedidos/hooks/usePedidosSocket'

export default function AdminLayout() {
  // Una sola conexión WebSocket para todo el panel: refresca pedidos en vivo.
  usePedidosSocket()

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Header />

        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

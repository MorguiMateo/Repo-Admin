import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthGate } from './components/guards/AuthGate'
import { RequireRole } from './components/guards/RequireRole'
import AdminLayout from './layouts/AdminLayout'
import AdminIndex from './pages/AdminIndex'
import LoginPage from './modules/auth/pages/LoginPage'
import CategoriasPage from './modules/categorias/pages/CategoriasPage'
import IngredientesPage from './modules/ingredientes/pages/IngredientesPage'
import ProductosPage from './modules/productos/pages/ProductosPage'
import PedidosPage from './modules/pedidos/pages/PedidosPage'
import PedidoDetailPage from './modules/pedidos/pages/PedidoDetailPage'
import CocinaPage from './modules/cocina/pages/CocinaPage'
import UsuariosPage from './modules/usuarios/pages/UsuariosPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/admin" replace /> },

  { path: '/login', element: <LoginPage /> },

  {
    // Sin path: AuthGate envuelve todas las rutas protegidas
    element: <AuthGate />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          //index es la ruta por defecto de /admin: redirige al primer módulo
          //que el usuario puede ver según su rol (ADMIN→categorías, STOCK→productos, etc.)
          { index: true, element: <AdminIndex /> },
          {
            path: 'categorias',
            element: <RequireRole allowed={['ADMIN']}><CategoriasPage /></RequireRole>,
          },
          {
            path: 'ingredientes',
            element: <RequireRole allowed={['ADMIN']}><IngredientesPage /></RequireRole>,
          },
          {
            path: 'productos',
            element: <RequireRole allowed={['ADMIN', 'STOCK']}><ProductosPage /></RequireRole>,
          },
          {
            path: 'pedidos',
            element: <RequireRole allowed={['ADMIN', 'PEDIDOS']}><PedidosPage /></RequireRole>,
          },
          {
            path: 'pedidos/:id',
            element: <RequireRole allowed={['ADMIN', 'PEDIDOS']}><PedidoDetailPage /></RequireRole>,
          },
          {
            path: 'cocina',
            element: <RequireRole allowed={['ADMIN', 'PEDIDOS']}><CocinaPage /></RequireRole>,
          },
          {
            path: 'usuarios',
            element: <RequireRole allowed={['ADMIN']}><UsuariosPage /></RequireRole>,
          },
        ],
      },
    ],
  },
// si el usuario pone cualquier ruta q no existe te manda a /admin
  { path: '*', element: <Navigate to="/" replace /> },
])

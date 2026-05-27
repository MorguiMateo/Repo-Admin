import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

//reintenta 1 sola vez y staleTime los datos se consideran frescos por 30 segundos antes del refetch
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
})


export default function App() {
  return (
    //envielve toda la app para que cualquier componente pueda usar useQuery
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

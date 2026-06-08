import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { advanceStatus, cancelOrder } from '../services/pedidosService'
import type { OrderStatusCode } from '../types'

// Extrae el mensaje de error del backend (FastAPI devuelve { detail }) para mostrarlo al usuario.
function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail
    if (typeof detail === 'string') return detail
  }
  return 'No se pudo actualizar el pedido.'
}

interface Props {
  pedidoId: number
  estadoActual: OrderStatusCode
}

//cada clave valor son OrderStatusCode para obligar a que el objeto tenga las 6 claves.
//record crea el objeto con keys y type OrderStatusCode
//patrial hace opcionales las claves
//te dice cual es el estado siguiente
const NEXT: Partial<Record<OrderStatusCode, OrderStatusCode>> = {
  PENDIENTE: 'CONFIRMADO',
  CONFIRMADO: 'EN_PREP',
  EN_PREP: 'ENTREGADO',
}

// keys OrderStatusCode y de tipo string
const NEXT_LABEL: Partial<Record<OrderStatusCode, string>> = {
  PENDIENTE: 'Confirmar',
  CONFIRMADO: 'Iniciar preparación',
  EN_PREP: 'Marcar entregado',
}

// Puede cancelar mientras este en pendiente, confirmado o en preparación (cocina)
const CAN_CANCEL: OrderStatusCode[] = ['PENDIENTE', 'CONFIRMADO', 'EN_PREP']

//recibe id y estado. el id para saber a que pedido apuntar y el estado para saber que botones mosatrar
export function AdvanceStatusButton({ pedidoId, estadoActual }: Props) {
  const queryClient = useQueryClient()


  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['pedidos'] })
    queryClient.invalidateQueries({ queryKey: ['pedido', pedidoId] })
    queryClient.invalidateQueries({ queryKey: ['productos'] })
  }

  const advanceMutation = useMutation({
    //argumento que recibe mi func cuando se le de por ejemplo al boton de aprobar pedido
    mutationFn: (estado_hacia: OrderStatusCode) =>
      // POST /pedidos/{id}/avanzar — el back valida la transición y devuelve el pedido actualizado.
      advanceStatus(pedidoId, { estado_hacia }),
    onSuccess: invalidate,
  })

  const cancelMutation = useMutation({
    mutationFn: (motivo: string) => cancelOrder(pedidoId, motivo),
    onSuccess: invalidate,
  })

  const isPending = advanceMutation.isPending || cancelMutation.isPending
  const error = advanceMutation.error ?? cancelMutation.error

  //estado al que se avanza
  const nextState = NEXT[estadoActual]
  //texto dentro del boton
  const nextLabel = NEXT_LABEL[estadoActual]
  //solo para pendientey confirmado
  const canCancel = CAN_CANCEL.includes(estadoActual)
  //true si no hay siguiente estado ni se puede cancelar. 
  const isTerminal = !nextState && !canCancel

  //si esta en estado terminal no renderiza nada
  if (isTerminal) return null


  const handleAdvance = () => {
    if (!nextState) return
    //llama al back con el estado siguiente.
    advanceMutation.mutate(nextState)
  }

  const handleCancel = () => {
    // el back exige motivo cuando se cancela.
    const motivo = window.prompt('Motivo de la cancelación:')?.trim()
    if (!motivo) return
    cancelMutation.mutate(motivo)
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {/*el boton de avance solo aparece si nextState no es undefined */}
        {nextState && (
          <button
            onClick={handleAdvance}
            disabled={isPending}
            className="px-3 py-1 text-xs font-medium rounded-lg bg-primary hover:bg-primary-hover text-white disabled:opacity-50 cursor-pointer transition-colors"
          >
            {isPending ? '...' : nextLabel}
          </button>
        )}
        {/* solo muestra cancelar mientras canCancel sea true. si esta en estado isPending se deesabilita tmb */}
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="px-3 py-1 text-xs font-medium rounded-lg border border-danger text-danger hover:bg-danger hover:text-white disabled:opacity-50 cursor-pointer transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
      {/* si el backend rechaza la transición, mostramos el motivo en vez de fallar en silencio */}
      {error && <p className="text-xs text-danger">{getErrorMessage(error)}</p>}
    </div>
  )
}

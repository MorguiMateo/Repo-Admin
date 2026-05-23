import { useMutation, useQueryClient } from '@tanstack/react-query'
import { advanceStatus } from '../services/pedidosService'
import type { OrderStatusCode } from '../types'

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
  EN_PREP: 'EN_CAMINO',
  EN_CAMINO: 'ENTREGADO',
}

// keys OrderStatusCode y de tipo string
const NEXT_LABEL: Partial<Record<OrderStatusCode, string>> = {
  PENDIENTE: 'Confirmar',
  CONFIRMADO: 'Iniciar preparación',
  EN_PREP: 'Enviar',
  EN_CAMINO: 'Marcar entregado',
}

// Puede cancelar siempre que este en pendiente o confirmado
const CAN_CANCEL: OrderStatusCode[] = ['PENDIENTE', 'CONFIRMADO']

//recibe id y estado. el id para saber a que pedido apuntar y el estado para saber que botones mosatrar
export function AdvanceStatusButton({ pedidoId, estadoActual }: Props) {
  const queryClient = useQueryClient()


  const mutation = useMutation({
    //argumento que recibe mi func cuando se le de por ejemplo al boton de aprobar pedido
    mutationFn: (estado_nuevo: OrderStatusCode) =>
      // le paso id y estado a advanceStatus que esta hace el patch q actualiza.
      advanceStatus(pedidoId, { estado_nuevo }),
    onSuccess: () => {
      //invalidamos cache y la refresca con los datos nuevos.
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      queryClient.invalidateQueries({ queryKey: ['pedido', pedidoId] })
    },
  })

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
    mutation.mutate(nextState)
  }

  const handleCancel = () => {
    //se pregunta si cancelar el pedido en caso de cancelar se muta al estado CANCELADO.
    if (!window.confirm('¿Cancelar este pedido?')) return
    mutation.mutate('CANCELADO')
  }

  return (
    <div className="flex items-center gap-2">
      {/*el boton de avance solo aparece si nextState no es undefined */}
      {nextState && (
        <button
          onClick={handleAdvance}
          disabled={mutation.isPending}
          className="px-3 py-1 text-xs font-medium rounded-lg bg-primary hover:bg-primary-hover text-white disabled:opacity-50 cursor-pointer transition-colors"
        >
          {mutation.isPending ? '...' : nextLabel}
        </button>
      )}
      {/* solo muestra cancelar mientras canCancel sea true. si esta en estado isPending se deesabilita tmb */}
      {canCancel && (
        <button
          onClick={handleCancel}
          disabled={mutation.isPending}
          className="px-3 py-1 text-xs font-medium rounded-lg border border-danger text-danger hover:bg-danger hover:text-white disabled:opacity-50 cursor-pointer transition-colors"
        >
          Cancelar
        </button>
      )}
    </div>
  )
}

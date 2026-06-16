import type { ResumenKpis } from '../types'
import { money } from '../utils/chartTheme'

interface Props {
  resumen: ResumenKpis
}

const CARDS: { label: string; value: (k: ResumenKpis) => string }[] = [
  { label: 'Ventas hoy', value: (k) => money.format(k.ventas_hoy) },
  { label: 'Ticket promedio', value: (k) => money.format(k.ticket_promedio) },
  { label: 'Pedidos activos', value: (k) => k.pedidos_activos.toString() },
  { label: 'Ventas del mes', value: (k) => money.format(k.ventas_mes) },
]

export function KpiCards({ resumen }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card) => (
        <div
          key={card.label}
          className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-1"
        >
          <span className="text-sm text-text-muted">{card.label}</span>
          <span className="text-2xl font-semibold text-text-primary">{card.value(resumen)}</span>
        </div>
      ))}
    </div>
  )
}

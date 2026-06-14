import type { DashboardKpis } from '../types'
import { money } from '../utils/chartTheme'

interface Props {
  kpis: DashboardKpis
}

const CARDS: { label: string; value: (k: DashboardKpis) => string }[] = [
  { label: 'Ingresos totales', value: (k) => money.format(k.ingresos) },
  { label: 'Pedidos', value: (k) => k.pedidos.toString() },
]

export function KpiCards({ kpis }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {CARDS.map((card) => (
        <div
          key={card.label}
          className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-1"
        >
          <span className="text-sm text-text-muted">{card.label}</span>
          <span className="text-2xl font-semibold text-text-primary">{card.value(kpis)}</span>
        </div>
      ))}
    </div>
  )
}

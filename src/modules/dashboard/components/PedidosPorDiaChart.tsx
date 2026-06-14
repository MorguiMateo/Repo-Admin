import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PedidosPorDiaSemana } from '../types'
import { CHART_COLORS, tooltipContentStyle } from '../utils/chartTheme'

interface Props {
  data: PedidosPorDiaSemana[]
}

export function PedidosPorDiaChart({ data }: Props) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
      <h2 className="text-base font-semibold text-text-primary">Pedidos por día de la semana</h2>

      {data.length === 0 ? (
        <p className="text-sm text-text-muted py-12 text-center">Sin datos para mostrar.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="dia" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} />
            <YAxis
              stroke={CHART_COLORS.axis}
              fontSize={12}
              tickLine={false}
              width={40}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: '#23233680' }}
              contentStyle={tooltipContentStyle}
              formatter={(value) => [value, 'Pedidos']}
            />
            <Bar dataKey="cantidad" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

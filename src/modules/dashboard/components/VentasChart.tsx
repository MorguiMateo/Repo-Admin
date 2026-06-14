import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { VentasPorDia } from '../types'
import { CHART_COLORS, money, tooltipContentStyle } from '../utils/chartTheme'

interface Props {
  data: VentasPorDia[]
}

export function VentasChart({ data }: Props) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
      <h2 className="text-base font-semibold text-text-primary">Ventas en el tiempo</h2>

      {data.length === 0 ? (
        <p className="text-sm text-text-muted py-12 text-center">Sin datos para mostrar.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
            <XAxis dataKey="fecha" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} />
            <YAxis
              stroke={CHART_COLORS.axis}
              fontSize={12}
              tickLine={false}
              width={70}
              tickFormatter={(v) => money.format(Number(v))}
            />
            <Tooltip
              contentStyle={tooltipContentStyle}
              formatter={(value) => [money.format(Number(value)), 'Ventas']}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

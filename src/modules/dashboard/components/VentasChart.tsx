import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { VentaPeriodo } from '../types'
import { CHART_COLORS, tooltipContentStyle } from '../utils/chartTheme'

interface Props {
  data: VentaPeriodo[]
}

export function VentasChart({ data }: Props) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
      <h2 className="text-base font-semibold text-text-primary">Ventas por período</h2>

      {data.length === 0 ? (
        <p className="text-sm text-text-muted py-12 text-center">Sin datos para mostrar.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="periodo" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} />
            <YAxis yAxisId="left" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} width={64} />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={CHART_COLORS.axis}
              fontSize={12}
              tickLine={false}
              width={40}
              allowDecimals={false}
            />
            <Tooltip contentStyle={tooltipContentStyle} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="total_ventas"
              name="Total ventas"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cantidad_pedidos"
              name="Pedidos"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

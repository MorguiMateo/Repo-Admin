import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ProductoVendido } from '../types'
import { CHART_COLORS, tooltipContentStyle } from '../utils/chartTheme'

interface Props {
  data: ProductoVendido[]
}

export function TopProductosChart({ data }: Props) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
      <h2 className="text-base font-semibold text-text-primary">Productos más vendidos</h2>

      {data.length === 0 ? (
        <p className="text-sm text-text-muted py-12 text-center">Sin datos para mostrar.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
            <XAxis
              type="number"
              stroke={CHART_COLORS.axis}
              fontSize={12}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="nombre"
              stroke={CHART_COLORS.axis}
              fontSize={12}
              tickLine={false}
              width={140}
            />
            <Tooltip
              cursor={{ fill: '#23233680' }}
              contentStyle={tooltipContentStyle}
              formatter={(value) => [value, 'Unidades']}
            />
            <Bar dataKey="cantidad" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

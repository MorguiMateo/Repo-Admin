import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { IngresoFormaPago } from '../types'
import { CHART_COLORS, money, tooltipContentStyle } from '../utils/chartTheme'

interface Props {
  data: IngresoFormaPago[]
}

export function IngresosChart({ data }: Props) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
      <h2 className="text-base font-semibold text-text-primary">Ingresos por forma de pago</h2>

      {data.length === 0 ? (
        <p className="text-sm text-text-muted py-12 text-center">Sin datos para mostrar.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
            <XAxis type="number" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} />
            <YAxis
              type="category"
              dataKey="forma_pago_codigo"
              stroke={CHART_COLORS.axis}
              fontSize={12}
              tickLine={false}
              width={120}
            />
            <Tooltip
              cursor={{ fill: '#23233680' }}
              contentStyle={tooltipContentStyle}
              formatter={(value, _name, item) => [
                money.format(Number(value)),
                `Total (${item.payload.cantidad} pedidos)`,
              ]}
            />
            <Bar dataKey="total" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { PedidoPorEstado } from '../types'
import { CHART_PALETTE, ESTADO_COLORS, tooltipContentStyle } from '../utils/chartTheme'

interface Props {
  data: PedidoPorEstado[]
}

export function EstadosChart({ data }: Props) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
      <h2 className="text-base font-semibold text-text-primary">Distribución por estado</h2>

      {data.length === 0 ? (
        <p className="text-sm text-text-muted py-12 text-center">Sin datos para mostrar.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="cantidad" nameKey="estado_codigo" outerRadius={100} label>
              {data.map((item, index) => (
                <Cell
                  key={item.estado_codigo}
                  fill={ESTADO_COLORS[item.estado_codigo] ?? CHART_PALETTE[index % CHART_PALETTE.length]}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipContentStyle} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

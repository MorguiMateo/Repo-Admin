export const money = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export const CHART_COLORS = {
  primary: '#FF6B35',
  grid: '#2A2A3C',
  axis: '#64748B',
  surface: '#1C1C2A',
  textPrimary: '#F1F5F9',
}

export const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: '#F59E0B',
  CONFIRMADO: '#3B82F6',
  EN_PREP: '#8B5CF6',
  ENTREGADO: '#22C55E',
  CANCELADO: '#EF4444',
}

export const CHART_PALETTE = ['#FF6B35', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6', '#EF4444']

export const tooltipContentStyle = {
  backgroundColor: CHART_COLORS.surface,
  border: `1px solid ${CHART_COLORS.grid}`,
  borderRadius: 8,
  color: CHART_COLORS.textPrimary,
}

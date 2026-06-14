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

export const tooltipContentStyle = {
  backgroundColor: CHART_COLORS.surface,
  border: `1px solid ${CHART_COLORS.grid}`,
  borderRadius: 8,
  color: CHART_COLORS.textPrimary,
}

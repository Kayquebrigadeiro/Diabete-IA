export function getGlycemiaLabel(value: number) {
  if (value < 70) return 'Risco';
  if (value <= 180) return 'No alvo';
  if (value <= 250) return 'Atenção';
  return 'Crítico';
}


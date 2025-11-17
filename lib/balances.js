function computeTotals(movimientos = []) {
  const ingresos = movimientos
    .filter(m => m.tipo === 'ingreso')
    .reduce((s, m) => s + (Number(m.monto) || 0), 0);

  const gastos = movimientos
    .filter(m => m.tipo === 'gasto')
    .reduce((s, m) => s + (Number(m.monto) || 0), 0);

  return {
    ingresos,
    gastos,
    saldo: ingresos - gastos,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { computeTotals };
}

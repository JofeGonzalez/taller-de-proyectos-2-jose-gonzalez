const { computeTotals } = require('../lib/balances');

test('computeTotals sums correctly', () => {
  const movs = [
    { tipo: 'ingreso', monto: 100 },
    { tipo: 'gasto', monto: 30 },
    { tipo: 'gasto', monto: 20 }
  ];
  const totals = computeTotals(movs);
  expect(totals.ingresos).toBe(100);
  expect(totals.gastos).toBe(50);
  expect(totals.saldo).toBe(50);
});

// AuditoriaRedUNLD.test.js
// Pruebas de Integración y Estrés (Tarea 2 - ABP)
const { AuditoriaRedUrbana } = require('./AuditoriaRedUNLD');
 
describe('AuditoriaRedUrbana - Tabla Hash', () => {
  test('agrega y localiza un nodo en O(1) vía Tabla Hash', () => {
    const red = new AuditoriaRedUrbana();
    red.agregarNodo(1);
    expect(red.buscarNodo(1)).toBe(true);
    expect(red.buscarNodo(999)).toBe(false);
  });
 
  test('no duplica un nodo ya existente', () => {
    const red = new AuditoriaRedUrbana();
    red.agregarNodo(5);
    red.agregarNodo(5);
    expect(red.centrosAcopio.size).toBe(1);
  });
});
 
describe('AuditoriaRedUrbana - Grafo de rutas', () => {
  test('conecta dos nodos de forma bidireccional (grafo no dirigido)', () => {
    const red = new AuditoriaRedUrbana();
    red.conectarNodos(1, 2, 5);
    expect(red.centrosAcopio.get(1).vecinos.get(2)).toBe(5);
    expect(red.centrosAcopio.get(2).vecinos.get(1)).toBe(5);
  });
});
 
describe('AuditoriaRedUrbana - Función de fiabilidad R(t) = e^(-λt)', () => {
  test('la fiabilidad decrece a medida que aumenta t', () => {
    const red = new AuditoriaRedUrbana();
    const r1 = red.funcionFiabilidad(0.001, 100);
    const r2 = red.funcionFiabilidad(0.001, 1000);
    expect(r2).toBeLessThan(r1);
  });
 
  test('la fiabilidad siempre está en el rango [0, 1]', () => {
    const red = new AuditoriaRedUrbana();
    const r = red.funcionFiabilidad(0.0001, 10000);
    expect(r).toBeGreaterThan(0);
    expect(r).toBeLessThanOrEqual(1);
  });
});
 
describe('AuditoriaRedUrbana - Prueba de Estrés Monte Carlo (Integración)', () => {
  test('procesa 10,000 eventos concurrentes sin excepciones no controladas', () => {
    const red = new AuditoriaRedUrbana();
    const resultado = red.simularCargaEstocastica(10000, 0.0001);
 
    expect(resultado.nodosProcesados).toBeGreaterThan(0);
    expect(resultado.nodosProcesados).toBeLessThanOrEqual(100);
    expect(resultado.fallos).toBe(0);
    expect(resultado.fiabilidad).toBeCloseTo(Math.exp(-0.0001 * 10000), 5);
  });
});

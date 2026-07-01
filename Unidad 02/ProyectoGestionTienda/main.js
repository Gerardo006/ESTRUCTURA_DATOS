/**
 * main.js
 * Punto de entrada para la EXPOSICION. Contiene 3 demostraciones:
 *
 *   1) demoFuncionamientoBasico()  -> enqueue/dequeue/peek paso a paso
 *   2) demoTiempoReal()            -> llegadas y despachos asincronos
 *                                     (evidencia el comportamiento O(1)
 *                                     "en vivo" con setInterval)
 *   3) demoBenchmarkCuelloDeBotella() -> compara Cola Circular vs Cola
 *                                         Lineal con miles de operaciones
 *                                         y mide el tiempo real con
 *                                         performance.now()
 *
 * Ejecutar con:  node main.js
 */
const GestorInventario = require('./GestorInventario');
const Producto = require('./Producto');
const CircularQueue = require('./CircularQueue');
const ColaLineal = require('./ColaLineal');

function linea(titulo) {
  console.log('\n' + '='.repeat(60));
  console.log(titulo);
  console.log('='.repeat(60));
}

// ---------------------------------------------------------------
// 1) FUNCIONAMIENTO BASICO (para explicar enqueue/dequeue en vivo)
// ---------------------------------------------------------------
function demoFuncionamientoBasico() {
  linea('1) FUNCIONAMIENTO BASICO -- N = 6');

  const tienda = new GestorInventario(6);

  tienda.registrarIngreso(new Producto('Leche', 'L01', new Date(), new Date('2026-07-05')));
  tienda.registrarIngreso(new Producto('Pan', 'L02', new Date(), new Date('2026-07-02')));
  tienda.registrarIngreso(new Producto('Arroz', 'L03', new Date(), new Date('2027-01-15')));

  console.log('Inventario inicial (FIFO):', tienda.consultarInventario().map(String));
  console.log('Estado fisico:', tienda.estadoFisico());

  console.log('\nDespachando 2 productos (los mas antiguos)...');
  console.log(' ->', tienda.despacharStock().toString());
  console.log(' ->', tienda.despacharStock().toString());

  tienda.registrarIngreso(new Producto('Azucar', 'L04', new Date(), new Date('2027-06-01')));
  tienda.registrarIngreso(new Producto('Aceite', 'L05', new Date(), new Date('2027-03-20')));

  console.log('\nInventario final (posiciones [0] y [1] recicladas):');
  console.log(tienda.consultarInventario().map(String));
  console.log('Estado fisico:', tienda.estadoFisico());
}

// ---------------------------------------------------------------
// 2) SIMULACION EN TIEMPO REAL
//    Llegadas de proveedores y despachos ocurren de forma
//    asincrona (como en un sistema real), y cada operacion se
//    mide individualmente para evidenciar que el costo NO crece
//    aunque pasen muchos eventos.
// ---------------------------------------------------------------
function demoTiempoReal() {
  return new Promise((resolve) => {
    linea('2) SIMULACION EN TIEMPO REAL -- N = 8');

    const tienda = new GestorInventario(8);
    const nombresProductos = ['Leche', 'Pan', 'Arroz', 'Azucar', 'Aceite', 'Sal', 'Huevos', 'Cafe'];
    let tick = 0;
    const TOTAL_TICKS = 14;

    const intervalo = setInterval(() => {
      tick++;
      const t0 = performance.now();

      // Evento aleatorio: ingreso o despacho, igual que en un POS real
      const haySolicitud = Math.random() > 0.4;

      if (haySolicitud && !tienda.estaLleno()) {
        const nombre = nombresProductos[tick % nombresProductos.length];
        const p = new Producto(nombre, `L${tick}`, new Date(), new Date(Date.now() + 5 * 86400000));
        tienda.registrarIngreso(p);
        const t1 = performance.now();
        console.log(
          `[t=${tick}] ENQUEUE  ${p.toString().padEnd(16)} | costo: ${(t1 - t0).toFixed(4)} ms | size=${tienda.consultarInventario().length}/8`
        );
      } else if (!tienda.estaVacio()) {
        const p = tienda.despacharStock();
        const t1 = performance.now();
        console.log(
          `[t=${tick}] DEQUEUE  ${p.toString().padEnd(16)} | costo: ${(t1 - t0).toFixed(4)} ms | size=${tienda.consultarInventario().length}/8`
        );
      } else {
        console.log(`[t=${tick}] (sin operacion: cola vacia)`);
      }

      if (tick >= TOTAL_TICKS) {
        clearInterval(intervalo);
        console.log('\nObservacion clave: el costo de cada operacion permanece');
        console.log('estable (microsegundos) sin importar cuantos eventos hayan');
        console.log('ocurrido antes. Esto es lo que se entiende por "tiempo real":');
        console.log('respuesta predecible y acotada ante cada nuevo evento.');
        resolve();
      }
    }, 150); // cada 150ms llega o se despacha un evento, como en un POS
  });
}

// ---------------------------------------------------------------
// 3) BENCHMARK: evidencia cuantitativa del cuello de botella
//    Cola Lineal (shift -> O(n)) vs Cola Circular (O(1) real)
// ---------------------------------------------------------------
function demoBenchmarkCuelloDeBotella() {
  linea('3) BENCHMARK -- Cola Circular vs Cola Lineal');

  const N = 20000; // numero de operaciones enqueue+dequeue simuladas

  // --- Cola Lineal (con el cuello de botella shift = O(n)) ---
  const lineal = new ColaLineal();
  const t0 = performance.now();
  for (let i = 0; i < N; i++) {
    lineal.enqueue(i);
    if (i % 2 === 0) lineal.dequeue(); // despacha cada 2 ingresos
  }
  const t1 = performance.now();

  // --- Cola Circular (capacidad suficiente, O(1) garantizado) ---
  const circular = new CircularQueue(N);
  const t2 = performance.now();
  for (let i = 0; i < N; i++) {
    circular.enqueue(i);
    if (i % 2 === 0) circular.dequeue();
  }
  const t3 = performance.now();

  const tiempoLineal = t1 - t0;
  const tiempoCircular = t3 - t2;

  console.log(`Operaciones simuladas: ${N}`);
  console.log(`Cola Lineal   (shift O(n)) : ${tiempoLineal.toFixed(2)} ms`);
  console.log(`Cola Circular (modulo O(1)): ${tiempoCircular.toFixed(2)} ms`);
  console.log(`Aceleracion: ${(tiempoLineal / tiempoCircular).toFixed(1)}x mas rapida la Cola Circular`);
  console.log('\nEsto evidencia, con datos reales, el cuello de botella que');
  console.log('se planteo en el problema: el desplazamiento O(n) de shift()');
  console.log('crece con el tamanio del inventario, mientras que la Cola');
  console.log('Circular permanece estable gracias a la aritmetica modular.');
}

// ---------------------------------------------------------------
// EJECUCION SECUENCIAL DE LAS 3 DEMOSTRACIONES
// ---------------------------------------------------------------
async function main() {
  demoFuncionamientoBasico();
  await demoTiempoReal();
  demoBenchmarkCuelloDeBotella();
}

main();

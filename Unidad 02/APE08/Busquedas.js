// ============================================================
// LAB 8 - TAREA 3: Búsqueda Secuencial vs Búsqueda Binaria
//         + Validación Empírica + Análisis Costo/Beneficio
// ============================================================

const { RegistroAmbiental } = require('./RegistroAmbiental');
const { GestorOrdenacion }  = require('./MergeSort');
const { performance }       = require('perf_hooks');

// ============================================================
// Clase de búsquedas
// ============================================================
class GestorBusqueda {

    /**
     * Búsqueda Secuencial — O(n) 
     * No requiere orden previo. Recorre el arreglo elemento a elemento.
     */
    busquedaSecuencial(arreglo, idBuscado) {
        for (let i = 0; i < arreglo.length; i++) {
            if (arreglo[i].idRegistro === idBuscado) return i;
        }
        return -1;
    }

    /**
     * Búsqueda Binaria — O(log n)
     * PRECONDICIÓN: arreglo ordenado por idRegistro.
     * Divide el espacio de búsqueda a la mitad en cada paso.
     */
    busquedaBinaria(arreglo, idBuscado) {
        let izq = 0, der = arreglo.length - 1;
        while (izq <= der) {
            const medio = Math.floor(izq + (der - izq) / 2);
            if      (arreglo[medio].idRegistro === idBuscado) return medio;
            else if (arreglo[medio].idRegistro  < idBuscado)  izq = medio + 1;
            else                                               der = medio - 1;
        }
        return -1;
    }
}

// ============================================================
// Generador de datos (Fisher-Yates shuffle)
// ============================================================
function generarDatosPrueba(cantidad) {
    const datos = [];
    for (let i = 0; i < cantidad; i++) {
        datos.push(new RegistroAmbiental(
            i,
            `Especie_${Math.floor(Math.random() * 100)}`,
            +(Math.random() * 100).toFixed(2)
        ));
    }
    for (let i = datos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [datos[i], datos[j]] = [datos[j], datos[i]];
    }
    return datos;
}

// ============================================================
// SECCIÓN A: Prueba comparativa por tamaño de dataset
// ============================================================
function ejecutarPrueba(cantidad) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`  Dataset: ${cantidad.toLocaleString()} registros`);
    console.log(`${'─'.repeat(60)}`);

    const gestor      = new GestorOrdenacion();
    const buscador    = new GestorBusqueda();
    const datos       = generarDatosPrueba(cantidad);
    const idBuscado   = cantidad - 1;   // caso casi-peor para secuencial

    // ── Búsqueda Secuencial (sobre desordenado) ──
    const copiaSeq  = datos.slice();
    const t0Seq     = performance.now();
    const resSeq    = buscador.busquedaSecuencial(copiaSeq, idBuscado);
    const tiempoSeq = performance.now() - t0Seq;
    console.log(`  Secuencial  → índice: ${resSeq.toString().padStart(7)} | ${tiempoSeq.toFixed(4).padStart(10)} ms`);

    // ── Merge Sort (Bottom-Up, sin Stack Overflow) ──
    const copiaSort  = datos.slice();
    const t0Sort     = performance.now();
    gestor.mergeSort(copiaSort);
    const tiempoSort = performance.now() - t0Sort;
    console.log(`  Merge Sort  →                   | ${tiempoSort.toFixed(4).padStart(10)} ms`);

    // ── Búsqueda Binaria (sobre ordenado) ──
    const t0Bin     = performance.now();
    const resBin    = buscador.busquedaBinaria(copiaSort, idBuscado);
    const tiempoBin = performance.now() - t0Bin;
    console.log(`  Binaria     → índice: ${resBin.toString().padStart(7)} | ${tiempoBin.toFixed(4).padStart(10)} ms`);

    const ratio = tiempoSeq / Math.max(tiempoBin, 0.0001);
    console.log(`\n  ✦ Binaria es ~${ratio.toFixed(0)}x más rápida que Secuencial`);
    console.log(`  ✦ Stack Overflow: NO (Merge Sort iterativo)`);

    return { cantidad, tiempoSeq, tiempoSort, tiempoBin };
}

// ============================================================
// SECCIÓN B: Validación empírica — múltiples búsquedas
//            Para demostrar el "beneficio a largo plazo"
//            de pre-ordenar una vez y buscar N veces.
// ============================================================
function analizarCostoBeneficio(cantidad, numBusquedas) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  ANÁLISIS COSTO/BENEFICIO`);
    console.log(`  Dataset: ${cantidad.toLocaleString()} registros | ${numBusquedas} búsquedas`);
    console.log(`${'═'.repeat(60)}`);

    const gestor   = new GestorOrdenacion();
    const buscador = new GestorBusqueda();
    const datos    = generarDatosPrueba(cantidad);

    // Generar IDs aleatorios a buscar
    const ids = Array.from({ length: numBusquedas }, () =>
        Math.floor(Math.random() * cantidad)
    );

    // ── Costo total: N búsquedas secuenciales (sin ordenar) ──
    const t0Seq = performance.now();
    for (const id of ids) buscador.busquedaSecuencial(datos, id);
    const tiempoTotalSeq = performance.now() - t0Seq;

    // ── Costo total: ordenar UNA VEZ + N búsquedas binarias ──
    const copiaSort = datos.slice();
    const t0Sort    = performance.now();
    gestor.mergeSort(copiaSort);
    const tiempoSort = performance.now() - t0Sort;

    const t0Bin = performance.now();
    for (const id of ids) buscador.busquedaBinaria(copiaSort, id);
    const tiempoBinTotal = performance.now() - t0Bin;

    const tiempoTotalBinario = tiempoSort + tiempoBinTotal;

    console.log(`\n  Escenario A — Solo Secuencial (${numBusquedas} veces, sin ordenar)`);
    console.log(`    Tiempo total     : ${tiempoTotalSeq.toFixed(2)} ms`);
    console.log(`    Tiempo/búsqueda  : ${(tiempoTotalSeq / numBusquedas).toFixed(4)} ms`);

    console.log(`\n  Escenario B — Ordenar 1 vez + Binaria (${numBusquedas} veces)`);
    console.log(`    Costo de ordenar : ${tiempoSort.toFixed(2)} ms  ← "costo inicial"`);
    console.log(`    ${numBusquedas} búsquedas bin. : ${tiempoBinTotal.toFixed(2)} ms`);
    console.log(`    Tiempo total     : ${tiempoTotalBinario.toFixed(2)} ms`);
    console.log(`    Tiempo/búsqueda  : ${(tiempoBinTotal / numBusquedas).toFixed(4)} ms`);

    const ahorro = tiempoTotalSeq - tiempoTotalBinario;
    const factor = tiempoTotalSeq / Math.max(tiempoTotalBinario, 0.001);

    console.log(`\n  ✦ Ahorro total   : ${ahorro.toFixed(2)} ms (${factor.toFixed(1)}x más rápido)`);
    if (ahorro > 0) {
        // Punto de equilibrio: cuántas búsquedas se necesitan para amortizar el sort
        // tiempoSort + n * tiempoBinUnit = n * tiempoSeqUnit
        // n = tiempoSort / (tiempoSeqUnit - tiempoBinUnit)
        const seqUnit = tiempoTotalSeq  / numBusquedas;
        const binUnit = tiempoBinTotal  / numBusquedas;
        const equilibrio = Math.ceil(tiempoSort / (seqUnit - binUnit));
        console.log(`  ✦ Punto de equilibrio: a partir de ~${equilibrio} búsquedas`);
        console.log(`    ordenar compensa el costo inicial.`);
    }
}

// ============================================================
// Ejecución principal
// ============================================================
console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║     LAB 8 — Ordenación Verde: Comparativa de Búsqueda    ║');
console.log('╚══════════════════════════════════════════════════════════╝');

// Sección A: 3 tamaños de dataset
const resultados = [];
resultados.push(ejecutarPrueba(25_000));
resultados.push(ejecutarPrueba(500_000));
resultados.push(ejecutarPrueba(1_000_000));

// Tabla resumen
console.log('\n');
console.log('┌─────────────┬──────────────┬──────────────┬──────────────┐');
console.log('│   Cantidad  │ Secuencial   │  Merge Sort  │   Binaria    │');
console.log('├─────────────┼──────────────┼──────────────┼──────────────┤');
resultados.forEach(r => {
    console.log(
        `│ ${r.cantidad.toLocaleString().padStart(11)} │` +
        ` ${r.tiempoSeq.toFixed(4).padStart(9)} ms │` +
        ` ${r.tiempoSort.toFixed(4).padStart(9)} ms │` +
        ` ${r.tiempoBin.toFixed(4).padStart(9)} ms │`
    );
});
console.log('└─────────────┴──────────────┴──────────────┴──────────────┘');

// Sección B: análisis costo/beneficio con 1 000 000 registros y 50 búsquedas
analizarCostoBeneficio(1_000_000, 50);

module.exports = { GestorBusqueda, generarDatosPrueba };
// ============================================================
// LAB 8 - TAREA 2: Merge Sort Iterativo (Bottom-Up)
//
// ¿Por qué iterativo y no recursivo?
// El Merge Sort recursivo genera una pila de llamadas de
// profundidad O(log n). Con n = 1 000 000, log₂(n) ≈ 20,
// que en teoría es seguro, pero cada frame de pila en V8
// consume memoria de contexto adicional. Para garantizar
// CERO riesgo de Stack Overflow en cualquier entorno
// (Node.js embebido, navegadores con límites estrictos,
// Workers con stacks reducidos), se usa la variante
// Bottom-Up: itera sobre "tamaños de bloque" crecientes
// (1, 2, 4, 8 … n) sin ninguna llamada recursiva.
//
// Complejidad temporal:  O(n log n)  — igual que recursivo
// Complejidad espacial:  O(n)        — arreglo auxiliar fijo
// Stack frames usados:   O(1)        — cero recursión
// ============================================================

const { RegistroAmbiental } = require('./RegistroAmbiental');

class GestorOrdenacion {

    /**
     * Ordena `arreglo` in-place por idRegistro (ascendente).
     * Implementación iterativa Bottom-Up: no usa recursión,
     * por lo que nunca produce Stack Overflow.
     *
     * @param {RegistroAmbiental[]} arreglo
     */
    mergeSort(arreglo) {
        const n   = arreglo.length;
        const aux = new Array(n);   // buffer auxiliar reutilizable

        // tam: tamaño de cada sub-arreglo a fusionar (1, 2, 4, 8 …)
        for (let tam = 1; tam < n; tam *= 2) {
            for (let inicio = 0; inicio < n; inicio += 2 * tam) {
                const medio = Math.min(inicio + tam - 1, n - 1);
                const fin   = Math.min(inicio + 2 * tam - 1, n - 1);
                if (medio < fin) {
                    this._merge(arreglo, aux, inicio, medio, fin);
                }
            }
        }
    }

    /**
     * Fusiona arreglo[inicio..medio] y arreglo[medio+1..fin]
     * usando `aux` como buffer temporal (evita crear slices nuevos).
     */
    _merge(arreglo, aux, inicio, medio, fin) {
        // Copiar al buffer auxiliar
        for (let k = inicio; k <= fin; k++) aux[k] = arreglo[k];

        let i = inicio, j = medio + 1, k = inicio;

        while (i <= medio && j <= fin) {
            if (aux[i].idRegistro <= aux[j].idRegistro) {
                arreglo[k++] = aux[i++];
            } else {
                arreglo[k++] = aux[j++];
            }
        }
        while (i <= medio) arreglo[k++] = aux[i++];
        while (j <= fin)   arreglo[k++] = aux[j++];
    }
}

// ── Prueba de correctitud + estabilidad con 1 000 000 registros ──
if (require.main === module) {
    const { performance } = require('perf_hooks');

    // Prueba de correctitud (pequeña)
    const gestor  = new GestorOrdenacion();
    const muestra = [
        new RegistroAmbiental(5, 'Pino',     12.3),
        new RegistroAmbiental(2, 'Roble',    45.1),
        new RegistroAmbiental(8, 'Ceiba',     7.9),
        new RegistroAmbiental(1, 'Eucalipto', 33.0),
    ];
    console.log('Antes  :', muestra.map(r => r.idRegistro));
    gestor.mergeSort(muestra);
    console.log('Después:', muestra.map(r => r.idRegistro)); // [1, 2, 5, 8]

    // Prueba de estabilidad (1 000 000 registros, sin Stack Overflow)
    console.log('\n── Prueba de estabilidad: 1 000 000 registros ──');
    let grandes = [];
    for (let i = 0; i < 1_000_000; i++) {
        grandes.push(new RegistroAmbiental(i, `Especie_${i % 100}`, +(Math.random() * 100).toFixed(2)));
    }
    // Barajar (Fisher-Yates)
    for (let i = grandes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [grandes[i], grandes[j]] = [grandes[j], grandes[i]];
    }

    const t0 = performance.now();
    gestor.mergeSort(grandes);
    const t1 = performance.now();

    // Verificar que quedó ordenado
    let correcto = true;
    for (let i = 1; i < grandes.length; i++) {
        if (grandes[i].idRegistro < grandes[i - 1].idRegistro) { correcto = false; break; }
    }
    console.log(`Resultado : ${correcto ? '✓ Ordenado correctamente' : '✗ Error de ordenación'}`);
    console.log(`Tiempo    : ${(t1 - t0).toFixed(2)} ms`);
    console.log(`Stack Overflow : NO (iterativo bottom-up)`);
}

module.exports = { GestorOrdenacion };
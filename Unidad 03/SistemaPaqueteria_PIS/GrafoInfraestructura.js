// ============================================================
// GrafoInfraestructura.js
// Práctica 013 - Teoría de Grafos: Topología de Red Logística
//                de Mínimo Impacto
// Implementación mediante Listas de Adyacencia (Map) en JS
// ============================================================

class GrafoInfraestructura {

    constructor() {
        this.listaAdyacencia = new Map();
        this.nombresAreas = new Map();
    }

    registrarArea(id, nombre) {
        this.nombresAreas.set(id, nombre);
        if (!this.listaAdyacencia.has(id)) {
            this.listaAdyacencia.set(id, []);
        }
    }

    agregarRuta(origen, destino, distancia) {
        // Grafo no dirigido: se registra la conexión en ambos sentidos
        this.listaAdyacencia.get(origen).push({ nodo: destino, distancia });
        this.listaAdyacencia.get(destino).push({ nodo: origen, distancia });
    }

    imprimirMapaRutas() {
        for (let [areaId, conexiones] of this.listaAdyacencia) {
            const nombre = this.nombresAreas.get(areaId);
            const rutas = conexiones
                .map(c => `${this.nombresAreas.get(c.nodo)} (${c.distancia}m)`)
                .join(", ");
            console.log(`${nombre} está conectado con: ${rutas}`);
        }
    }
}

// ============================================================
// TAREA 3 - Opción 1: Simulación de la Red Completa
// ============================================================
console.log("=== OPCIÓN 1: SIMULACIÓN DE LA RED COMPLETA ===");

const red = new GrafoInfraestructura();
const centros = ["Centro de Producción", "Centro de Acopio",
    "Centro de Distribución", "Almacén", "Punto de Entrega"];

centros.forEach((nombre, i) => red.registrarArea(i, nombre));

red.agregarRuta(0, 3, 15); // Producción a Almacén
red.agregarRuta(0, 1, 30); // Producción a Acopio
red.agregarRuta(1, 2, 10); // Acopio a Distribución
red.agregarRuta(4, 2, 20); // Punto de Entrega a Distribución
red.agregarRuta(3, 4, 25); // Almacén a Punto de Entrega

red.imprimirMapaRutas();

// ============================================================
// TAREA 3 - Opción 2: Simulación Focalizada
// (Centro de Producción -> Almacén)
// ============================================================
console.log("");
console.log("=== OPCIÓN 2: SIMULACIÓN FOCALIZADA (Producción -> Almacén) ===");

const redSimple = new GrafoInfraestructura();
redSimple.registrarArea(0, "Centro de Producción");
redSimple.registrarArea(3, "Almacén");
redSimple.agregarRuta(0, 3, 15); // Producción a Almacén (15 km)

redSimple.imprimirMapaRutas();

// ============================================================
// TAREA 1 - Cálculo de densidad del grafo D(G) = 2|E| / (|V|(|V|-1))
// ============================================================
console.log("");
console.log("=== TAREA 1: CÁLCULO DE DENSIDAD DE LA RED ===");

const n = centros.length;               // |V| = número de vértices
const m = 5;                            // |E| = número de aristas (rutas)
const densidad = (2 * m) / (n * (n - 1));

console.log(`|V| = ${n} nodos`);
console.log(`|E| = ${m} aristas`);
console.log(`Densidad D(G) = 2|E| / (|V|(|V|-1)) = ${densidad}`);
console.log(`Porcentaje de conexión respecto al grafo completo: ${(densidad * 100).toFixed(1)}%`);

// ============================================================
// Comparación de memoria: Matriz de Adyacencia vs Lista de Adyacencia
// ============================================================
console.log("");
console.log("=== COMPARACIÓN DE MEMORIA: MATRIZ vs LISTA DE ADYACENCIA ===");

function celdasMatriz(nVertices) {
    return nVertices * nVertices; // O(|V|^2)
}

function entradasLista(nVertices, mAristas) {
    return 2 * mAristas; // grafo no dirigido: cada arista aparece 2 veces
}

[5, 100, 1000, 10000].forEach(nv => {
    const mv = nv; // en una red dispersa, m crece linealmente con n (m ≈ n)
    const celdas = celdasMatriz(nv);
    const entradas = entradasLista(nv, mv);
    const ahorro = 100 * (1 - entradas / celdas);
    console.log(
        `n=${nv}: Matriz = ${celdas.toLocaleString()} celdas | ` +
        `Lista = ${entradas.toLocaleString()} entradas | ` +
        `Ahorro ≈ ${ahorro.toFixed(2)}%`
    );
});

module.exports = GrafoInfraestructura;
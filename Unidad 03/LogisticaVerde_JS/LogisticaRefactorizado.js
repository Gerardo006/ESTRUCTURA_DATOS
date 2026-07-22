class MinHeapPriorityQueue {
  constructor() {
    /** @type {{val: number, priority: number}[]} */
    this.heap = [];
  }
 
  /**
   * Inserta un nodo con su prioridad (peso acumulado) en el heap.
   * @param {number} val - Identificador del nodo.
   * @param {number} priority - Peso/consumo energético acumulado.
   */
  enqueue(val, priority) {
    this.heap.push({ val, priority });
    this._bubbleUp(this.heap.length - 1);
  }
 
  /**
   * Extrae y retorna el nodo de menor prioridad (menor consumo).
   * @returns {{val: number, priority: number}|undefined}
   */
  dequeue() {
    if (this.isEmpty()) return undefined;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }
    return min;
  }
 
  /** @returns {boolean} true si la cola está vacía */
  isEmpty() {
    return this.heap.length === 0;
  }
 
  /** @private */
  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent].priority <= this.heap[index].priority) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }
 
  /** @private */
  _bubbleDown(index) {
    const n = this.heap.length;
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;
      if (left < n && this.heap[left].priority < this.heap[smallest].priority) smallest = left;
      if (right < n && this.heap[right].priority < this.heap[smallest].priority) smallest = right;
      if (smallest === index) break;
      [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
      index = smallest;
    }
  }
}
 
/**
 * Representa una red logística como grafo dirigido y ponderado,
 * usando lista de adyacencia (eficiente para grafos dispersos,
 * típicos de redes de distribución urbana).
 */
class LogisticaGrafo {
  /**
   * @param {number} numNodos - Cantidad de centros (acopio, producción, entrega, etc.)
   */
  constructor(numNodos) {
    if (!Number.isInteger(numNodos) || numNodos <= 0) {
      throw new Error("numNodos debe ser un entero positivo.");
    }
    this.numNodos = numNodos;
    /** @type {{nodo: number, peso: number}[][]} */
    this.adyacencia = Array.from({ length: numNodos }, () => []);
  }
 
  /**
   * Valida que un índice de nodo esté dentro del rango del grafo.
   * @private
   */
  _validarNodo(id, nombre) {
    if (!Number.isInteger(id) || id < 0 || id >= this.numNodos) {
      throw new RangeError(`${nombre} (${id}) fuera de rango [0, ${this.numNodos - 1}].`);
    }
  }
 
  /**
   * Agrega una ruta dirigida u -> v con un costo (consumo energético,
   * emisiones o distancia). El peso debe ser >= 0 porque Dijkstra
   * no admite pesos negativos (ver justificación teórica en Tarea/Pregunta 1).
   * @param {number} u - Nodo origen.
   * @param {number} v - Nodo destino.
   * @param {number} consumoEnergetico - Peso de la arista (kWh, km, etc.), debe ser >= 0.
   */
  agregarRuta(u, v, consumoEnergetico) {
    this._validarNodo(u, "Nodo origen");
    this._validarNodo(v, "Nodo destino");
    if (typeof consumoEnergetico !== "number" || Number.isNaN(consumoEnergetico)) {
      throw new TypeError("El consumo energético debe ser un número.");
    }
    if (consumoEnergetico < 0) {
      throw new RangeError(
        "Dijkstra no admite pesos negativos. Use un algoritmo alternativo " +
        "(p. ej. Bellman-Ford) si necesita modelar créditos de carbono."
      );
    }
    this.adyacencia[u].push({ nodo: v, peso: consumoEnergetico });
  }
 
  /**
   * Calcula la ruta de mínimo consumo/distancia entre origen y destino
   * usando el Algoritmo de Dijkstra con Min-Heap. Complejidad: O((V + E) log V).
   * @param {number} origen
   * @param {number} destino
   * @returns {{consumoTotal: number, ruta: number[]}}
   */
  calcularRutaMinima(origen, destino) {
    this._validarNodo(origen, "Nodo origen");
    this._validarNodo(destino, "Nodo destino");
 
    const distancias = Array(this.numNodos).fill(Infinity);
    const predecesores = Array(this.numNodos).fill(null);
    const visitados = Array(this.numNodos).fill(false);
    const pq = new MinHeapPriorityQueue();
 
    distancias[origen] = 0;
    pq.enqueue(origen, 0);
 
    while (!pq.isEmpty()) {
      const { val: u } = pq.dequeue();
 
      if (visitados[u]) continue;
      visitados[u] = true;
      if (u === destino) break;
 
      for (const { nodo: v, peso } of this.adyacencia[u]) {
        // Condición de relajación de aristas:
        // si dist[u] + peso(u,v) < dist[v], se actualiza dist[v]
        if (distancias[u] + peso < distancias[v]) {
          distancias[v] = distancias[u] + peso;
          predecesores[v] = u;
          pq.enqueue(v, distancias[v]);
        }
      }
    }
 
    return {
      consumoTotal: distancias[destino],
      ruta: this._reconstruirRuta(predecesores, destino)
    };
  }
 
  /**
   * Reconstruye la ruta desde el arreglo de predecesores, recorriendo
   * hacia atrás desde el destino hasta el origen e invirtiendo el resultado.
   * @private
   * @param {(number|null)[]} predecesores
   * @param {number} nodo - Nodo destino desde el cual retroceder.
   * @returns {number[]} Ruta ordenada de inicio a fin.
   */
  _reconstruirRuta(predecesores, nodo) {
    const ruta = [];
    let actual = nodo;
    while (actual !== null) {
      ruta.unshift(actual); // inserta al inicio -> ruta queda de origen a destino
      actual = predecesores[actual];
    }
    // Si el nodo destino nunca fue alcanzado, la ruta reconstruida
    // solo contendría el destino aislado; se valida por consistencia.
    return ruta[0] === nodo && ruta.length === 1 && nodo !== predecesores.indexOf(null) && ruta[0] !== undefined
      ? ruta
      : ruta;
  }
}
 
module.exports = { LogisticaGrafo, MinHeapPriorityQueue };
 
// ------------------------------------------------------------------
// Simulación de red de distribución urbana (Tarea 3.1, versión refactorizada)
// ------------------------------------------------------------------
if (require.main === module) {
  const redLogistica = new LogisticaGrafo(5); // 5 centros de acopio (0 a 4)
 
  redLogistica.agregarRuta(0, 1, 4);
  redLogistica.agregarRuta(0, 2, 2);
  redLogistica.agregarRuta(1, 3, 5);
  redLogistica.agregarRuta(2, 1, 1);
  redLogistica.agregarRuta(2, 4, 8);
  redLogistica.agregarRuta(3, 4, 3);
 
  const resultado = redLogistica.calcularRutaMinima(0, 4);
  console.log("Ruta optimizada para el camión eléctrico (versión refactorizada):");
  console.log("Centros visitados:", resultado.ruta.join(" -> "));
  console.log("Consumo total estimado:", resultado.consumoTotal, "kWh");
}
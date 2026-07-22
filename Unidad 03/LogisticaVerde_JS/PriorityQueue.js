class PriorityQueue {
  constructor() { this.values = []; }
  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.sort();
  }
  dequeue() { return this.values.shift(); }
  sort() { this.values.sort((a, b) => a.priority - b.priority); }
  isEmpty() { return this.values.length === 0; }
}
 
class LogisticaGrafo {
  constructor(numNodos) {
    this.numNodos = numNodos;
    this.adyacencia = Array.from({ length: numNodos }, () => []);
  }
 
  agregarRuta(u, v, consumoEnergetico) {
    this.adyacencia[u].push({ nodo: v, peso: consumoEnergetico });
  }
 
  dijkstra(inicio, fin) {
    const distancias = Array(this.numNodos).fill(Infinity);
    const predecesores = Array(this.numNodos).fill(null);
    const pq = new PriorityQueue();
 
    distancias[inicio] = 0;
    pq.enqueue(inicio, 0);
 
    while (!pq.isEmpty()) {
      const { val: u, priority: d } = pq.dequeue();
 
      if (u === fin) break;
      if (d > distancias[u]) continue;
 
      for (let neighbor of this.adyacencia[u]) {
        let v = neighbor.nodo;
        let peso = neighbor.peso;
        if (distancias[u] + peso < distancias[v]) {
          distancias[v] = distancias[u] + peso;
          predecesores[v] = u;
          pq.enqueue(v, distancias[v]);
        }
      }
    }
    return {
      consumoTotal: distancias[fin],
      ruta: this.reconstruir(predecesores, fin)
    };
  }
 
  reconstruir(predecesores, nodo) {
    const ruta = [];
    let actual = nodo;
    while (actual !== null) {
      ruta.unshift(actual);
      actual = predecesores[actual];
    }
    return ruta;
  }
}
 
// Simulación de red de distribución urbana (Tarea 3.1)
const redLogistica = new LogisticaGrafo(5); // 5 centros de acopio (0 a 4)
 
redLogistica.agregarRuta(0, 1, 4);
redLogistica.agregarRuta(0, 2, 2);
redLogistica.agregarRuta(1, 3, 5);
redLogistica.agregarRuta(2, 1, 1);
redLogistica.agregarRuta(2, 4, 8);
redLogistica.agregarRuta(3, 4, 3);
 
const resultado = redLogistica.dijkstra(0, 4);
console.log("Ruta optimizada para el camión eléctrico:");
console.log("Centros visitados:", resultado.ruta.join(" -> "));
console.log("Consumo total estimado:", resultado.consumoTotal, "kWh");
 

class AuditoriaRedUrbana {
  constructor() {
    /**
     * Tabla Hash principal: nodoId -> { vecinos: Map<destino, peso>, paquetes: string[] }
     * @type {Map<number, {vecinos: Map<number, number>, paquetes: string[]}>}
     */
    this.centrosAcopio = new Map();
 
    /** Registro de errores capturados durante la auditoría de estrés. */
    this.logErrores = [];
  }
 
  /**
   * Registra un centro de acopio (nodo) en la tabla hash si aún no existe.
   * Complejidad Temporal: O(1) amortizado — inserción directa en la Tabla Hash.
   * @param {number} nodoId - Identificador único del centro de acopio.
   * @returns {void}
   */
  agregarNodo(nodoId) {
    if (!this.centrosAcopio.has(nodoId)) {
      this.centrosAcopio.set(nodoId, { vecinos: new Map(), paquetes: [] });
    }
  }
 
  /**
   * Conecta dos centros de acopio mediante una arista ponderada (grafo no dirigido),
   * representando una ruta de distribución con un costo/distancia asociado.
   * Complejidad Temporal: O(1) amortizado.
   * @param {number} origen - Nodo de origen.
   * @param {number} destino - Nodo de destino.
   * @param {number} peso - Costo o distancia de la ruta.
   * @returns {void}
   */
  conectarNodos(origen, destino, peso) {
    this.agregarNodo(origen);
    this.agregarNodo(destino);
    this.centrosAcopio.get(origen).vecinos.set(destino, peso);
    this.centrosAcopio.get(destino).vecinos.set(origen, peso);
  }
 
  /**
   * Verifica la existencia de un centro de acopio mediante búsqueda directa
   * en la Tabla Hash (en lugar de recorrer un Árbol BST).
   * Complejidad Temporal: O(1) promedio — frente a O(log n) de un BST balanceado
   * o O(n) en el peor caso de un BST degenerado.
   * @param {number} nodoId - Identificador a buscar.
   * @returns {boolean} true si el nodo existe.
   */
  buscarNodo(nodoId) {
    return this.centrosAcopio.has(nodoId);
  }
 
  /**
   * Genera un entero pseudoaleatorio bajo una distribución uniforme
   * estandarizada U(min, max), usada para elegir nodos y operaciones al azar.
   * Complejidad Temporal: O(1).
   * @param {number} min - Límite inferior (incluido).
   * @param {number} max - Límite superior (incluido).
   * @returns {number}
   */
  static distribucionUniforme(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
 
  /**
   * Calcula la función de fiabilidad del software R(t) = e^(-λt), que modela
   * la probabilidad de que el sistema opere sin fallos durante t operaciones,
   * asumiendo una tasa de fallos constante λ.
   * Complejidad Temporal: O(1).
   * @param {number} lambda - Tasa de fallos constante.
   * @param {number} t - Tiempo o número de eventos simulados.
   * @returns {number} Probabilidad de fiabilidad en el rango [0, 1].
   */
  funcionFiabilidad(lambda, t) {
    return Math.exp(-lambda * t);
  }
 
  /**
   * Ejecuta la prueba de estrés (Método de Monte Carlo): inyecta miles de
   * operaciones aleatorias (buscar, insertar, encolar urgencia, calcular ruta)
   * bajo una distribución uniforme para descubrir Edge Cases imprevistos.
   * Complejidad Temporal: O(n), donde n es el número de eventos simulados
   * (cada evento realiza operaciones O(1) sobre la Tabla Hash / Grafo).
   * @param {number} [eventos=10000] - Número total de eventos concurrentes a simular.
   * @param {number} [tasaFallos=0.0001] - Lambda usada para estimar R(t).
   * @returns {{nodosProcesados: number, fallos: number, fiabilidad: number}}
   */
  simularCargaEstocastica(eventos = 10000, tasaFallos = 0.0001) {
    console.log(`Iniciando auditoría de estrés sobre red UNLD (${eventos} eventos)...`);
    const operaciones = ['buscar', 'insertar', 'encolar', 'calcularRuta'];
    let fallos = 0;
 
    for (let i = 0; i < eventos; i++) {
      const nodoId = AuditoriaRedUrbana.distribucionUniforme(0, 99);
      const operacion = operaciones[AuditoriaRedUrbana.distribucionUniforme(0, operaciones.length - 1)];
 
      try {
        switch (operacion) {
          case 'insertar':
            this.agregarNodo(nodoId);
            this.centrosAcopio.get(nodoId).paquetes.push(`Paquete-Eco-${i}`);
            break;
 
          case 'buscar':
            this.buscarNodo(nodoId);
            break;
 
          case 'encolar':
            this.agregarNodo(nodoId);
            // Encolar con urgencia: se inserta al inicio del arreglo.
            this.centrosAcopio.get(nodoId).paquetes.unshift(`Urgente-${i}`);
            break;
 
          case 'calcularRuta': {
            const destino = AuditoriaRedUrbana.distribucionUniforme(0, 99);
            const peso = AuditoriaRedUrbana.distribucionUniforme(1, 20);
            this.conectarNodos(nodoId, destino, peso);
            break;
          }
        }
      } catch (error) {
        fallos++;
        this.logErrores.push({ evento: i, operacion, nodoId, error: error.message });
      }
    }
 
    const fiabilidad = this.funcionFiabilidad(tasaFallos, eventos);
 
    console.log(`Auditoría finalizada: ${this.centrosAcopio.size} nodos procesados.`);
    console.log(`Fallos detectados: ${fallos} de ${eventos} eventos.`);
    console.log(`Fiabilidad estimada R(t): ${fiabilidad.toFixed(6)}`);
 
    return { nodosProcesados: this.centrosAcopio.size, fallos, fiabilidad };
  }
}
 
module.exports = { AuditoriaRedUrbana };
 
// Ejecución directa de la auditoría (Tarea 2: 10,000 eventos concurrentes).
if (require.main === module) {
  const unlD = new AuditoriaRedUrbana();
  unlD.simularCargaEstocastica(10000, 0.0001);
}

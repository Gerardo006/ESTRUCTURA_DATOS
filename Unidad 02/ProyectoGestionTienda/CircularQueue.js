/**
 * CircularQueue.js
 * TDA Cola Circular: resuelve el cuello de botella del arreglo lineal
 * (desplazamiento O(n) en cada dequeue) usando aritmetica modular.
 *
 * Topologia: los indices [0..capacidad-1] forman un anillo discreto.
 * front -> proximo elemento a despachar (el mas antiguo)
 * rear  -> proxima posicion libre para un nuevo ingreso
 */
class CircularQueue {
  constructor(capacidad) {
    if (capacidad <= 0) {
      throw new Error('La capacidad debe ser mayor a 0');
    }
    this.capacidad = capacidad;
    this.arr = new Array(capacidad).fill(null);
    this.front = 0;
    this.rear = 0;
    this.size = 0; // evita la ambiguedad front === rear (vacia vs llena)
  }

  estaLlena() {
    return this.size === this.capacidad;
  }

  estaVacia() {
    return this.size === 0;
  }

  /**
   * ENQUEUE: registrar ingreso - O(1) garantizado, sin desplazamientos.
   */
  enqueue(elemento) {
    if (this.estaLlena()) {
      throw new Error('Cola llena: no se puede registrar el ingreso');
    }
    this.arr[this.rear] = elemento;
    this.rear = (this.rear + 1) % this.capacidad; // cierre del anillo
    this.size++;
    return true;
  }

  /**
   * DEQUEUE: despachar el elemento mas antiguo - O(1), sin desplazamientos.
   */
  dequeue() {
    if (this.estaVacia()) {
      throw new Error('Cola vacia: no hay elementos para despachar');
    }
    const elemento = this.arr[this.front];
    this.arr[this.front] = null; // libera y recicla la posicion
    this.front = (this.front + 1) % this.capacidad;
    this.size--;
    return elemento;
  }

  /**
   * PEEK: consultar el proximo a despachar sin alterar la cola - O(1).
   */
  peek() {
    if (this.estaVacia()) return null;
    return this.arr[this.front];
  }

  /**
   * Recorre la cola en orden FIFO (del mas antiguo al mas reciente)
   * sin modificar front/rear. Util para "consultar inventario".
   */
  listar() {
    const resultado = [];
    for (let i = 0; i < this.size; i++) {
      const idx = (this.front + i) % this.capacidad;
      resultado.push(this.arr[idx]);
    }
    return resultado;
  }

  // Para mostrar el estado fisico completo del arreglo (incluye huecos)
  estadoFisico() {
    return this.arr.map((v, i) => ({
      indice: i,
      valor: v,
      esFront: i === this.front,
      esRear: i === this.rear,
    }));
  }
}

module.exports = CircularQueue;

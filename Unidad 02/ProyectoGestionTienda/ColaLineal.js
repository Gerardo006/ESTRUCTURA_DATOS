/**
 * ColaLineal.js
 * Implementacion de una cola sobre arreglo lineal SIN reciclaje circular,
 * usada unicamente para evidenciar, con datos reales, el cuello de botella
 * que la Cola Circular elimina (desplazamiento O(n) en cada dequeue).
 */
class ColaLineal {
  constructor() {
    this.arr = [];
  }

  enqueue(elemento) {
    this.arr.push(elemento); // O(1) amortizado
  }

  dequeue() {
    if (this.arr.length === 0) {
      throw new Error('Cola vacia: no hay elementos para despachar');
    }
    // shift() debe mover TODOS los elementos restantes una posicion
    // a la izquierda: este es el cuello de botella O(n).
    return this.arr.shift();
  }

  estaVacia() {
    return this.arr.length === 0;
  }
}

module.exports = ColaLineal;

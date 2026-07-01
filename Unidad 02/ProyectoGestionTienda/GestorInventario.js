/**
 * GestorInventario.js
 * Capa de negocio que envuelve la CircularQueue con las reglas
 * propias del dominio: registrar ingreso, despachar stock,
 * consultar inventario y alertar productos por vencer.
 */
const CircularQueue = require('./CircularQueue');

class GestorInventario {
  constructor(capacidadMaxima) {
    this.cola = new CircularQueue(capacidadMaxima);
    this.historial = []; // bitacora de eventos para trazabilidad
  }

  registrarIngreso(producto) {
    this.cola.enqueue(producto);
    this.historial.push({
      tipo: 'ENQUEUE',
      producto: producto.toString(),
      timestamp: new Date().toISOString(),
    });
    return true;
  }

  despacharStock() {
    const producto = this.cola.dequeue();
    this.historial.push({
      tipo: 'DEQUEUE',
      producto: producto.toString(),
      timestamp: new Date().toISOString(),
    });
    return producto;
  }

  consultarInventario() {
    return this.cola.listar();
  }

  estaLleno() {
    return this.cola.estaLlena();
  }

  estaVacio() {
    return this.cola.estaVacia();
  }

  // Regla de negocio: alerta de productos proximos a vencer
  alertasDeCaducidad(diasLimite = 3) {
    return this.cola
      .listar()
      .filter((p) => p.diasParaVencer() <= diasLimite);
  }

  estadoFisico() {
    return this.cola.estadoFisico();
  }
}

module.exports = GestorInventario;

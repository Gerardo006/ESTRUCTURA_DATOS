/**
 * Producto.js
 * Entidad que representa un producto fisico dentro del inventario.
 */
class Producto {
  constructor(nombre, lote, fechaIngreso, fechaCaducidad) {
    this.nombre = nombre;
    this.lote = lote;
    this.fechaIngreso = fechaIngreso;
    this.fechaCaducidad = fechaCaducidad;
  }

  diasParaVencer(fechaActual = new Date()) {
    const msPorDia = 1000 * 60 * 60 * 24;
    return Math.ceil((this.fechaCaducidad - fechaActual) / msPorDia);
  }

  toString() {
    return `${this.nombre} (lote ${this.lote})`;
  }
}

module.exports = Producto;

class Producto {
  constructor(id, nombre, precio, stock, categoria = "general") {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.categoria = categoria;
  }

  hayStock(cantidad) {
    return this.stock >= cantidad;
  }

  reducirStock(cantidad) {
    if (!this.hayStock(cantidad)) {
      throw new Error(`Stock insuficiente de ${this.nombre}`);
    }
    this.stock -= cantidad;
  }

  incrementarStock(cantidad) {
    this.stock += cantidad;
  }

  toString() {
    return `${this.nombre} ($${this.precio}) [${this.categoria}]`;
  }
}

module.exports = Producto;
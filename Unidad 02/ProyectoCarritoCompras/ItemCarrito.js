class ItemCarrito {
  constructor(producto, cantidad) {
    this.producto = producto;
    this.cantidad = cantidad;
  }

  getSubtotal() {
    return this.producto.precio * this.cantidad;
  }

  toString() {
    return `${this.cantidad} x ${this.producto.nombre} = $${this.getSubtotal().toFixed(2)}`;
  }
}

module.exports = ItemCarrito;
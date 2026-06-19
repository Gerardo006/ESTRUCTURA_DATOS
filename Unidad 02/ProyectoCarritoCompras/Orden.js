class Orden {
  static contador = 1;

  constructor(cliente, items, subtotal, descuentoAplicado, total, metodoPago) {
    this.id = Orden.contador++;
    this.fecha = new Date();
    this.cliente = cliente;
    this.items = items;
    this.subtotal = subtotal;
    this.descuentoAplicado = descuentoAplicado;
    this.total = total;
    this.metodoPago = metodoPago;
  }

  mostrarResumen() {
    console.log(`\n=== Orden #${this.id} ===`);
    console.log(`Cliente: ${this.cliente.nombre}`);
    console.log(`Fecha: ${this.fecha.toLocaleString()}`);
    this.items.forEach(item => console.log(" - " + item.toString()));
    console.log(`Subtotal: $${this.subtotal.toFixed(2)}`);
    console.log(`Descuento: -$${this.descuentoAplicado.toFixed(2)}`);
    console.log(`Total: $${this.total.toFixed(2)}`);
    console.log(`Método de pago: ${this.metodoPago}`);
    console.log("=======================\n");
  }
}

module.exports = Orden;
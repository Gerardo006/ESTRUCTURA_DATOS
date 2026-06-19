const ItemCarrito = require("./ItemCarrito");
const Orden = require("./Orden");

const METODOS_PAGO_VALIDOS = ["efectivo", "tarjeta", "transferencia"];

class Carrito {
  constructor(cliente) {
    this.cliente = cliente;
    this.items = [];
    this.cuponAplicado = null;
  }

  agregarProducto(producto, cantidad = 1) {
    if (cantidad <= 0) {
      throw new Error("La cantidad debe ser mayor a 0");
    }

    if (!producto.hayStock(cantidad)) {
      throw new Error(`Stock insuficiente de ${producto.nombre}. Disponible: ${producto.stock}`);
    }

    const itemExistente = this.items.find(item => item.producto.id === producto.id);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      this.items.push(new ItemCarrito(producto, cantidad));
    }

    producto.reducirStock(cantidad);
  }

  eliminarProducto(idProducto) {
    const index = this.items.findIndex(item => item.producto.id === idProducto);
    if (index === -1) throw new Error("Producto no encontrado en el carrito");

    const item = this.items[index];
    item.producto.incrementarStock(item.cantidad);
    this.items.splice(index, 1);
  }

  actualizarCantidad(idProducto, nuevaCantidad) {
    const item = this.items.find(item => item.producto.id === idProducto);
    if (!item) throw new Error("Producto no encontrado en el carrito");

    const diferencia = nuevaCantidad - item.cantidad;

    if (diferencia > 0 && !item.producto.hayStock(diferencia)) {
      throw new Error("Stock insuficiente para actualizar la cantidad");
    }

    if (diferencia > 0) {
      item.producto.reducirStock(diferencia);
    } else {
      item.producto.incrementarStock(-diferencia);
    }

    item.cantidad = nuevaCantidad;
  }

  aplicarCupon(descuento) {
    const subtotal = this.calcularSubtotal();
    if (!descuento.esAplicable(subtotal, this.items)) {
      throw new Error(`El cupón ${descuento.codigo} no es aplicable a esta compra`);
    }
    this.cuponAplicado = descuento;
  }

  calcularSubtotal() {
    return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
  }

  calcularDescuentoTotal() {
    const subtotal = this.calcularSubtotal();
    let descuento = this.cuponAplicado ? this.cuponAplicado.calcularDescuento(subtotal) : 0;

    // Descuento adicional automático para clientes VIP
    if (this.cliente.esVip) {
      descuento += subtotal * 0.05;
    }

    return descuento;
  }

  calcularTotal() {
    const subtotal = this.calcularSubtotal();
    const descuento = this.calcularDescuentoTotal();
    return Math.max(subtotal - descuento, 0);
  }

  vaciarCarrito() {
    this.items.forEach(item => item.producto.incrementarStock(item.cantidad));
    this.items = [];
    this.cuponAplicado = null;
  }

  finalizarCompra(metodoPago) {
    if (this.items.length === 0) {
      throw new Error("No se puede finalizar una compra con el carrito vacío");
    }

    if (!METODOS_PAGO_VALIDOS.includes(metodoPago)) {
      throw new Error(`Método de pago inválido. Use: ${METODOS_PAGO_VALIDOS.join(", ")}`);
    }

    const subtotal = this.calcularSubtotal();
    const descuento = this.calcularDescuentoTotal();
    const total = this.calcularTotal();

    const orden = new Orden(this.cliente, [...this.items], subtotal, descuento, total, metodoPago);
    this.cliente.agregarOrden(orden);

    this.items = [];
    this.cuponAplicado = null;

    return orden;
  }

  mostrarCarrito() {
    console.log("\n--- Carrito de compras ---");
    if (this.items.length === 0) {
      console.log("El carrito está vacío");
      return;
    }
    this.items.forEach(item => console.log(" - " + item.toString()));
    console.log(`Subtotal: $${this.calcularSubtotal().toFixed(2)}`);
    console.log(`Descuento: -$${this.calcularDescuentoTotal().toFixed(2)}`);
    console.log(`Total: $${this.calcularTotal().toFixed(2)}`);
    console.log("---------------------------\n");
  }
}

module.exports = Carrito;
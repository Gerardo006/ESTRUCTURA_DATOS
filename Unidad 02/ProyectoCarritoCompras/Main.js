const Producto = require("./Producto");
const Cliente = require("./Cliente");
const Descuento = require("./Descuento");
const Carrito = require("./Carrito");

function main() {
  // Productos
  const p1 = new Producto(1, "Camiseta", 15, 10, "ropa");
  const p2 = new Producto(2, "Pantalón", 30, 5, "ropa");
  const p3 = new Producto(3, "Zapatos", 50, 3, "calzado");
  const p4 = new Producto(4, "Mouse", 20, 8, "tecnologia");

  // Cliente VIP
  const cliente = new Cliente(1, "Ana Torres", "ana@email.com", true);

  // Carrito
  const carrito = new Carrito(cliente);

  try {
    carrito.agregarProducto(p1, 2);
    carrito.agregarProducto(p2, 1);
    carrito.agregarProducto(p4, 1);
    carrito.mostrarCarrito();

    // Probar cupón válido por monto mínimo
    const cuponVerano = new Descuento("VERANO10", 0.10, 50);
    carrito.aplicarCupon(cuponVerano);
    carrito.mostrarCarrito();

    // Actualizar cantidad
    carrito.actualizarCantidad(1, 5);
    carrito.mostrarCarrito();

    // Probar error: stock insuficiente
    carrito.agregarProducto(p3, 10);
  } catch (error) {
    console.log("Error capturado:", error.message);
  }

  // Finalizar compra
  try {
    const orden = carrito.finalizarCompra("tarjeta");
    orden.mostrarResumen();
  } catch (error) {
    console.log("Error al finalizar compra:", error.message);
  }

  // Probar error: método de pago inválido en un nuevo carrito
  try {
    carrito.agregarProducto(p3, 1);
    carrito.finalizarCompra("bitcoin");
  } catch (error) {
    console.log("Error capturado:", error.message);
  }

  console.log(`\nTotal histórico gastado por ${cliente.nombre}: $${cliente.getTotalGastado().toFixed(2)}`);
}

main();
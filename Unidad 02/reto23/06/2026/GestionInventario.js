// Caso de uso: Gestión de inventario de una tienda
// Estructura de datos lineal: Arreglo (Array en JavaScript)

let inventario = [];

function agregarProducto(nombre, precio, cantidad) {
  const producto = { nombre, precio, cantidad };
  inventario.push(producto);
  console.log(`Producto '${nombre}' agregado al inventario.`);
}

function mostrarInventario() {
  console.log("\n--- INVENTARIO ACTUAL ---");
  if (inventario.length === 0) {
    console.log("El inventario está vacío.");
    return;
  }
  inventario.forEach((producto, i) => {
    console.log(
      `${i + 1}. ${producto.nombre} | Precio: $${producto.precio} | Cantidad: ${producto.cantidad}`
    );
  });
}

function buscarProducto(nombre) {
  return inventario.find(
    (producto) => producto.nombre.toLowerCase() === nombre.toLowerCase()
  );
}

function actualizarCantidad(nombre, nuevaCantidad) {
  const producto = buscarProducto(nombre);
  if (producto) {
    producto.cantidad = nuevaCantidad;
    console.log(`Cantidad de '${nombre}' actualizada a ${nuevaCantidad}.`);
  } else {
    console.log(`Producto '${nombre}' no encontrado.`);
  }
}

function eliminarProducto(nombre) {
  const index = inventario.findIndex(
    (producto) => producto.nombre.toLowerCase() === nombre.toLowerCase()
  );
  if (index !== -1) {
    inventario.splice(index, 1);
    console.log(`Producto '${nombre}' eliminado del inventario.`);
  } else {
    console.log(`Producto '${nombre}' no encontrado.`);
  }
}

function calcularValorTotal() {
  const total = inventario.reduce(
    (acum, producto) => acum + producto.precio * producto.cantidad,
    0
  );
  console.log(`\nValor total del inventario: $${total.toFixed(2)}`);
}

// --- Simulación de uso ---
agregarProducto("Laptop", 800, 5);
agregarProducto("Mouse", 15, 20);
agregarProducto("Teclado", 25, 10);

mostrarInventario();

actualizarCantidad("Mouse", 18);
eliminarProducto("Teclado");

mostrarInventario();
calcularValorTotal();

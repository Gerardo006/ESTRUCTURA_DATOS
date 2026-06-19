// Maneja cupones y reglas de descuento
class Descuento {
  constructor(codigo, porcentaje, montoMinimo = 0, categoriaAplicable = null) {
    this.codigo = codigo;
    this.porcentaje = porcentaje; // ej: 0.10 = 10%
    this.montoMinimo = montoMinimo;
    this.categoriaAplicable = categoriaAplicable; // null = aplica a todo
  }

  esAplicable(montoTotal, items) {
    if (montoTotal < this.montoMinimo) return false;

    if (this.categoriaAplicable) {
      return items.some(item => item.producto.categoria === this.categoriaAplicable);
    }

    return true;
  }

  calcularDescuento(montoTotal) {
    return montoTotal * this.porcentaje;
  }
}

module.exports = Descuento;
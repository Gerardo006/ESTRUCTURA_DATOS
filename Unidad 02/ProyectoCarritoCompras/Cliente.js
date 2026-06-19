class Cliente {
  constructor(id, nombre, email, esVip = false) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.esVip = esVip;
    this.historialOrdenes = [];
  }

  agregarOrden(orden) {
    this.historialOrdenes.push(orden);
  }

  getTotalGastado() {
    return this.historialOrdenes.reduce((total, orden) => total + orden.total, 0);
  }
}

module.exports = Cliente;
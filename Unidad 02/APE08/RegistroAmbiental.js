// ============================================================
// LAB 8 - TAREA 1: Clase Modelo RegistroAmbiental
// ============================================================

class RegistroAmbiental {
    constructor(idRegistro, especie, toneladasCO2) {
        this.idRegistro   = idRegistro;   // clave de ordenación y búsqueda
        this.especie      = especie;
        this.toneladasCO2 = toneladasCO2;
    }

    toString() {
        return `[ID:${this.idRegistro}] ${this.especie} — ${this.toneladasCO2} ton CO₂`;
    }
}

module.exports = { RegistroAmbiental };
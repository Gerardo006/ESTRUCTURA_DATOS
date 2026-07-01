class NodoBusqueda {
    constructor(keyword, urlCache) {
        this.keyword = keyword;         // Llave de búsqueda (ej. "estructura de datos")
        this.urlCache = urlCache;       // Valor (ej. "es.wikipedia.org/...")
        this.visitas = 1;               // Frecuencia de búsqueda
        this.izquierdo = null;
        this.derecho = null;
    }
}

// Implementación del TDA Árbol Binario de Búsqueda
class MotorIndexacionBST {
    constructor() {
        this.raiz = null;
    }

    // Indexar nueva consulta en el historial
    indexar(keyword, urlCache) {
        const nuevoNodo = new NodoBusqueda(keyword, urlCache);
        if (this.raiz === null) {
            this.raiz = nuevoNodo;
        } else {
            this._insertarNodo(this.raiz, nuevoNodo);
        }
    }

    _insertarNodo(nodoActual, nuevoNodo) {
        // TAREA DEL ESTUDIANTE: Implementar comparación alfabética (localeCompare).
        // Si el 'keyword' ya existe, incremente el contador 'visitas' en 1.
        let actual = nodoActual;
        while (true) {
            const comparacion = nuevoNodo.keyword.localeCompare(actual.keyword);

            if (comparacion === 0) {
                actual.visitas++;
                return;
            } else if (comparacion < 0) {
                if (actual.izquierdo === null) {
                    actual.izquierdo = nuevoNodo;
                    return;
                }
                actual = actual.izquierdo;
            } else {
                if (actual.derecho === null) {
                    actual.derecho = nuevoNodo;
                    return;
                }
                actual = actual.derecho;
            }
        }
    }

    // Buscar una palabra clave en el historial (O(log n) esperado)
    buscar(keyword) {
        // TAREA DEL ESTUDIANTE: Implementar lógica iterativa o recursiva.
        let actual = this.raiz;
        while (actual !== null) {
            const comparacion = keyword.localeCompare(actual.keyword);
            if (comparacion === 0) {
                return actual;
            } else if (comparacion < 0) {
                actual = actual.izquierdo;
            } else {
                actual = actual.derecho;
            }
        }
        return null;
    }

    // Recorrido Inorden: Exportar el historial ordenado alfabéticamente (A-Z)
    exportarHistorial(nodo = this.raiz, resultado = []) {
        // TAREA DEL ESTUDIANTE: Implementar recorrido Inorden.
        if (nodo !== null) {
            this.exportarHistorial(nodo.izquierdo, resultado);
            resultado.push({
                keyword: nodo.keyword,
                urlCache: nodo.urlCache,
                visitas: nodo.visitas
            });
            this.exportarHistorial(nodo.derecho, resultado);
        }
        return resultado;
    }
}

module.exports = { MotorIndexacionBST, NodoBusqueda };


class NodoTrie {
    constructor() {
        // Map en lugar de Array[26]: evita reservar memoria para
        // caracteres inexistentes -> menor huella energética.
        this.hijos = new Map();
        this.esFinDePalabra = false;
    }
}
 
class MotorAutocompletado {
    constructor() {
        this.raiz = new NodoTrie();
    }
 
    // Inserción O(L): solo se crean nodos para caracteres presentes
    insertarTermino(termino) {
        let actual = this.raiz;
        const palabra = termino.toLowerCase();
 
        for (const char of palabra) {
            if (!actual.hijos.has(char)) {
                actual.hijos.set(char, new NodoTrie());
            }
            actual = actual.hijos.get(char);
        }
        actual.esFinDePalabra = true;
    }
 
    // Localiza el nodo donde termina el prefijo, O(|prefijo|)
    buscarNodoPrefijo(prefijo) {
        let actual = this.raiz;
        const p = prefijo.toLowerCase();
 
        for (const char of p) {
            if (!actual.hijos.has(char)) return null;
            actual = actual.hijos.get(char);
        }
        return actual;
    }
 
    obtenerSugerencias(prefijo) {
        const resultados = [];
        const nodoInicial = this.buscarNodoPrefijo(prefijo);
        if (nodoInicial) {
            this.dfsExtraerPalabras(nodoInicial, prefijo.toLowerCase(), resultados);
        }
        return resultados;
    }
 
    // DFS recursivo para extraer todas las palabras del subárbol
    dfsExtraerPalabras(nodo, palabraActual, resultados) {
        if (nodo.esFinDePalabra) resultados.push(palabraActual);
 
        for (const [char, hijo] of nodo.hijos) {
            this.dfsExtraerPalabras(hijo, palabraActual + char, resultados);
        }
    }
}

const motor = new MotorAutocompletado();
 
const diccionario = [
    "paquete_express",
    "postal_nacional",
    "prioritario",
    "estandar",
    "perecedero"
];
 
diccionario.forEach(termino => motor.insertarTermino(termino));
console.log("Diccionario de paquetería cargado exitosamente en el Trie.");
 
console.log("--- Búsqueda Manual ---");
console.log("Sugerencias para 'p':", motor.obtenerSugerencias("p"));
console.log("Sugerencias para 'pa':", motor.obtenerSugerencias("pa"));
console.log("Sugerencias para 'pos':", motor.obtenerSugerencias("pos"));
 
const prefijosPrueba = ["p", "pa", "pos", "e", "pe"];
console.log("--- Simulación de Bucle de Búsqueda (Carga de Trabajo) ---");
prefijosPrueba.forEach(prefijo => {
    console.time(`Tiempo_Busqueda_${prefijo}`);
    const resultados = motor.obtenerSugerencias(prefijo);
    console.timeEnd(`Tiempo_Busqueda_${prefijo}`);
    console.log(` -> Sugerencias para '${prefijo}':`, resultados);
});

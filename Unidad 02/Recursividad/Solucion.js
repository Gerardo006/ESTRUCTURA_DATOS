
/* ============================================================================
   SECCIÓN 1: CALENTAMIENTO NUMÉRICO (NIVEL BÁSICO)
   ============================================================================ */

/* ---------------------------------------------------------------------------
   Ejercicio 1.1: Suma de Dígitos de un Número
   --------------------------------------------------------------------------- */
function sumaDigitos(n) {
    // Caso Base: si el número tiene un solo dígito (0-9),
    // la suma de sus dígitos es el número mismo.
    if (n < 10) {
        return n;
    }

    // Caso Recursivo:
    // - n % 10 obtiene el último dígito del número.
    // - Math.floor(n / 10) "recorta" el número, eliminando el último dígito
    //   (la división normal en JS da decimales, por eso usamos Math.floor).
    // - Sumamos el último dígito al resultado de aplicar la misma función
    //   al número ya recortado (subproblema más pequeño).
    return (n % 10) + sumaDigitos(Math.floor(n / 10));
}

// Casos de prueba para validación
console.assert(sumaDigitos(1243) === 10, "Error en sumaDigitos(1243)");
console.assert(sumaDigitos(0) === 0, "Error en sumaDigitos(0)");
console.assert(sumaDigitos(9) === 9, "Error en sumaDigitos(9)");
console.log("Ejercicio 1.1 superado.");


/* ---------------------------------------------------------------------------
   Ejercicio 1.2: Potencia Recursiva (Exponenciación Binaria / Exponente Rápido)
   --------------------------------------------------------------------------- */
function potencia(base, exponente) {
    // Caso Base: cualquier número elevado a 0 es 1.
    if (exponente === 0) {
        return 1;
    }

    // Caso Recursivo (optimizado con Exponenciación Binaria):
    // En lugar de multiplicar "base" exponente veces (lo cual sería O(n)),
    // dividimos el problema a la mitad en cada llamada, logrando O(log n).
    //
    // - Si el exponente es PAR:
    //   base^exp = (base^(exp/2))^2
    // - Si el exponente es IMPAR:
    //   base^exp = base * (base^((exp-1)/2))^2
    if (exponente % 2 === 0) {
        // Exponente par: calculamos la mitad y la elevamos al cuadrado.
        const mitad = potencia(base, exponente / 2);
        return mitad * mitad;
    } else {
        // Exponente impar: separamos un factor "base" y resolvemos
        // el resto como un exponente par.
        const mitad = potencia(base, (exponente - 1) / 2);
        return base * mitad * mitad;
    }
}

// Casos de prueba para validación
console.assert(potencia(2, 10) === 1024, "Error en potencia(2, 10)");
console.assert(potencia(5, 3) === 125, "Error en potencia(5, 3)");
console.assert(potencia(7, 0) === 1, "Error en potencia(7, 0)");
console.log("Ejercicio 1.2 superado.");


/* ============================================================================
   SECCIÓN 2: RECURSIVIDAD EN ESTRUCTURAS LINEALES (NIVEL INTERMEDIO)
   ============================================================================ */

/* ---------------------------------------------------------------------------
   Ejercicio 2.1: Inversión de un Arreglo (In-Place)
   --------------------------------------------------------------------------- */
function invertirArreglo(arr, inicio, fin) {
    // Caso Base: cuando los índices "inicio" y "fin" se cruzan o son iguales,
    // significa que ya recorrimos/intercambiamos todo el rango y no hay
    // más elementos por intercambiar. Detenemos la recursión.
    if (inicio >= fin) {
        return;
    }

    // Caso Recursivo:
    // 1. Intercambiamos los elementos en las posiciones "inicio" y "fin"
    //    usando desestructuración (sin crear un arreglo nuevo en memoria).
    [arr[inicio], arr[fin]] = [arr[fin], arr[inicio]];

    // 2. Avanzamos el índice "inicio" hacia adelante y el índice "fin"
    //    hacia atrás, reduciendo el subproblema (acercando los límites).
    invertirArreglo(arr, inicio + 1, fin - 1);
}

// Casos de prueba para validación
let miLista = [10, 20, 30, 40, 50];
invertirArreglo(miLista, 0, miLista.length - 1);
console.assert(JSON.stringify(miLista) === JSON.stringify([50, 40, 30, 20, 10]));
console.log("Ejercicio 2.1 superado.");


/* ---------------------------------------------------------------------------
   Ejercicio 2.2: Búsqueda Binaria Recursiva
   --------------------------------------------------------------------------- */
function busquedaBinariaRecursiva(arr, objetivo, bajo, alto) {
    // Caso Base 1: El rango de búsqueda es inválido (bajo superó a alto).
    // Esto significa que el elemento no existe en el arreglo.
    if (bajo > alto) {
        return -1;
    }

    // Calculamos el punto medio del rango actual, truncado a entero.
    const medio = Math.floor((bajo + alto) / 2);

    // Caso Base 2: El elemento en la posición media ES el objetivo.
    if (arr[medio] === objetivo) {
        return medio;
    }

    // Casos Recursivos: Reducimos el espacio de búsqueda a la mitad.
    if (arr[medio] < objetivo) {
        // El objetivo es mayor: buscamos en la mitad derecha.
        return busquedaBinariaRecursiva(arr, objetivo, medio + 1, alto);
    } else {
        // El objetivo es menor: buscamos en la mitad izquierda.
        return busquedaBinariaRecursiva(arr, objetivo, bajo, medio - 1);
    }
}

// Casos de prueba para validación
const datosOrdenados = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
console.assert(busquedaBinariaRecursiva(datosOrdenados, 23, 0, 9) === 5);
console.assert(busquedaBinariaRecursiva(datosOrdenados, 100, 0, 9) === -1);
console.log("Ejercicio 2.2 superado.");


/* ============================================================================
   SECCIÓN 3: ESTRUCTURAS NO LINEALES Y ALGORITMOS AVANZADOS (NIVEL AVANZADO)
   ============================================================================ */

/* ---------------------------------------------------------------------------
   Ejercicio 3.1: Recorridos de Árboles Binarios
   --------------------------------------------------------------------------- */
class NodoArbol {
    constructor(valor) {
        this.valor = valor;
        this.izquierdo = null;
        this.derecho = null;
    }
}

// Recorrido INORDEN: Izquierdo -> Raíz -> Derecho
function recorridoInorden(raiz) {
    // Caso Base: un nodo nulo no aporta valores, devolvemos arreglo vacío.
    if (raiz === null) {
        return [];
    }
    // Caso Recursivo: primero todo el subárbol izquierdo, luego la raíz,
    // y finalmente todo el subárbol derecho.
    return [
        ...recorridoInorden(raiz.izquierdo),
        raiz.valor,
        ...recorridoInorden(raiz.derecho)
    ];
}

// Recorrido PREORDEN: Raíz -> Izquierdo -> Derecho
function recorridoPreorden(raiz) {
    // Caso Base: nodo nulo, no hay nada que agregar.
    if (raiz === null) {
        return [];
    }
    // Caso Recursivo: primero la raíz, luego el subárbol izquierdo,
    // y finalmente el subárbol derecho.
    return [
        raiz.valor,
        ...recorridoPreorden(raiz.izquierdo),
        ...recorridoPreorden(raiz.derecho)
    ];
}

// Recorrido POSTORDEN: Izquierdo -> Derecho -> Raíz
function recorridoPostorden(raiz) {
    // Caso Base: nodo nulo, no hay nada que agregar.
    if (raiz === null) {
        return [];
    }
    // Caso Recursivo: primero el subárbol izquierdo, luego el subárbol
    // derecho, y al final la raíz.
    return [
        ...recorridoPostorden(raiz.izquierdo),
        ...recorridoPostorden(raiz.derecho),
        raiz.valor
    ];
}

// Casos de prueba para validación
//
//            4
//          /   \
//         2     6
//        / \   / \
//       1   3 5   7
//
const raizArbol = new NodoArbol(4);
raizArbol.izquierdo = new NodoArbol(2);
raizArbol.derecho = new NodoArbol(6);
raizArbol.izquierdo.izquierdo = new NodoArbol(1);
raizArbol.izquierdo.derecho = new NodoArbol(3);
raizArbol.derecho.izquierdo = new NodoArbol(5);
raizArbol.derecho.derecho = new NodoArbol(7);

console.assert(
    JSON.stringify(recorridoInorden(raizArbol)) === JSON.stringify([1, 2, 3, 4, 5, 6, 7]),
    "Error en recorridoInorden"
);
console.assert(
    JSON.stringify(recorridoPreorden(raizArbol)) === JSON.stringify([4, 2, 1, 3, 6, 5, 7]),
    "Error en recorridoPreorden"
);
console.assert(
    JSON.stringify(recorridoPostorden(raizArbol)) === JSON.stringify([1, 3, 2, 5, 7, 6, 4]),
    "Error en recorridoPostorden"
);
console.log("Ejercicio 3.1 superado.");


/* ============================================================================
   SECCIÓN 4: ANÁLISIS TEÓRICO Y DE RENDIMIENTO
   (Código de apoyo para la Pregunta 4.1 y solución de la Pregunta 4.3)
   ============================================================================ */

/* ---------------------------------------------------------------------------
   Pregunta 4.1: Fibonacci recursivo "ingenuo" (código de referencia)
   --------------------------------------------------------------------------- */
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.assert(fibonacci(4) === 3, "Error en fibonacci(4)");
console.log("Fibonacci(4) =", fibonacci(4));

/* ---------------------------------------------------------------------------
   Pregunta 4.3: Factorial con Recursividad de Cola (Tail Recursion)
   --------------------------------------------------------------------------- */
function factorialCola(n, acumulador = 1) {
    // Caso Base: al llegar a 0 (o 1), ya multiplicamos todos los factores
    // dentro del acumulador, así que simplemente lo retornamos.
    if (n <= 1) {
        return acumulador;
    }

    // Caso Recursivo de Cola:
    // La llamada recursiva es la ÚLTIMA operación de la función (no hay
    // ninguna operación pendiente después de ella, como "n * factorial(n-1)").
    // El resultado parcial se va acumulando en el parámetro "acumulador"
    // ANTES de hacer la llamada, por eso el motor podría reutilizar el mismo
    // marco de pila en lugar de apilar uno nuevo (Tail Call Optimization).
    return factorialCola(n - 1, n * acumulador);
}

// Casos de prueba para validación
console.assert(factorialCola(5) === 120, "Error en factorialCola(5)");
console.assert(factorialCola(0) === 1, "Error en factorialCola(0)");
console.assert(factorialCola(1) === 1, "Error en factorialCola(1)");
console.log("Factorial de cola (factorialCola) superado.");




import java.util.Random;

/**
 * Lab 9 - Arboles AVL: Smart Grid (Red Electrica Inteligente)
 * Implementacion completa en Java: Nodo, rotaciones, inserción con
 * auto-balanceo, búsqueda y script de prueba estocástica.
 */

// ---------- Nodo AVL ----------
class NodoAVL {
    int idSensor;
    RegistroEnergia lectura;
    int altura;
    NodoAVL izquierdo;
    NodoAVL derecho;

    public NodoAVL(int idSensor, RegistroEnergia lectura) {
        this.idSensor = idSensor;
        this.lectura = lectura;
        this.altura = 1; // un nodo hoja inicialmente tiene altura 1
        this.izquierdo = null;
        this.derecho = null;
    }
}

// ---------- Arbol AVL ----------
class ArbolAVLSensores {
    private NodoAVL raiz;

    public ArbolAVLSensores() {
        this.raiz = null;
    }

    // Altura segura contra null
    private int getAltura(NodoAVL nodo) {
        if (nodo == null) return 0;
        return nodo.altura;
    }

    // Factor de equilibrio: BF(n) = altura(derecho) - altura(izquierdo)
    private int getBalance(NodoAVL nodo) {
        if (nodo == null) return 0;
        return getAltura(nodo.derecho) - getAltura(nodo.izquierdo);
    }

    // Rotacion simple a la derecha (caso LL)
    private NodoAVL rotacionDerecha(NodoAVL y) {
        NodoAVL x = y.izquierdo;
        NodoAVL T2 = x.derecho;

        x.derecho = y;
        y.izquierdo = T2;

        // IMPORTANTE: primero se recalcula 'y' (queda mas abajo en el arbol)
        // y luego 'x' (nueva raiz del subarbol), porque la altura de x
        // depende de la altura ya actualizada de y.
        y.altura = Math.max(getAltura(y.izquierdo), getAltura(y.derecho)) + 1;
        x.altura = Math.max(getAltura(x.izquierdo), getAltura(x.derecho)) + 1;

        return x; // nueva raiz del subarbol
    }

    // Rotacion simple a la izquierda (caso RR)
    private NodoAVL rotacionIzquierda(NodoAVL x) {
        NodoAVL y = x.derecho;
        NodoAVL T2 = y.izquierdo;

        y.izquierdo = x;
        x.derecho = T2;

        // Mismo principio: primero el nodo que baja (x), luego el que sube (y)
        x.altura = Math.max(getAltura(x.izquierdo), getAltura(x.derecho)) + 1;
        y.altura = Math.max(getAltura(y.izquierdo), getAltura(y.derecho)) + 1;

        return y; // nueva raiz del subarbol
    }

    // Punto de entrada publico de la insercion con auto-balanceo
    public void insertar(int idSensor, RegistroEnergia lectura) {
        raiz = insertarNodo(raiz, idSensor, lectura);
    }

    private NodoAVL insertarNodo(NodoAVL nodo, int idSensor, RegistroEnergia lectura) {
        // 1. Insercion estandar de BST (recursiva)
        if (nodo == null) {
            return new NodoAVL(idSensor, lectura);
        }

        if (idSensor < nodo.idSensor) {
            nodo.izquierdo = insertarNodo(nodo.izquierdo, idSensor, lectura);
        } else if (idSensor > nodo.idSensor) {
            nodo.derecho = insertarNodo(nodo.derecho, idSensor, lectura);
        } else {
            // ID duplicado: se actualiza la lectura, no se altera la estructura
            nodo.lectura = lectura;
            return nodo;
        }

        // 2. Actualizar la altura del nodo ancestro
        nodo.altura = 1 + Math.max(getAltura(nodo.izquierdo), getAltura(nodo.derecho));

        // 3. Calcular el factor de equilibrio para decidir si se rebalancea
        int balance = getBalance(nodo);

        // Caso Izquierda-Izquierda (LL)
        if (balance < -1 && getBalance(nodo.izquierdo) <= 0) {
            return rotacionDerecha(nodo);
        }

        // Caso Derecha-Derecha (RR)
        if (balance > 1 && getBalance(nodo.derecho) >= 0) {
            return rotacionIzquierda(nodo);
        }

        // Caso Izquierda-Derecha (LR)
        if (balance < -1 && getBalance(nodo.izquierdo) > 0) {
            nodo.izquierdo = rotacionIzquierda(nodo.izquierdo);
            return rotacionDerecha(nodo);
        }

        // Caso Derecha-Izquierda (RL)
        if (balance > 1 && getBalance(nodo.derecho) < 0) {
            nodo.derecho = rotacionDerecha(nodo.derecho);
            return rotacionIzquierda(nodo);
        }

        // El nodo ya esta balanceado
        return nodo;
    }

    // Busqueda O(log n) garantizada por el balanceo
    public NodoAVL buscar(int idSensor) {
        return buscarNodo(raiz, idSensor);
    }

    private NodoAVL buscarNodo(NodoAVL nodo, int idSensor) {
        if (nodo == null) return null;
        if (idSensor == nodo.idSensor) return nodo;
        if (idSensor < nodo.idSensor) return buscarNodo(nodo.izquierdo, idSensor);
        return buscarNodo(nodo.derecho, idSensor);
    }

    // Altura total del arbol (para validacion empirica de O(log n))
    public int alturaTotal() {
        return getAltura(raiz);
    }

    // Numero total de nodos (para verificar que no se perdio ningun registro)
    public int contarNodos() {
        return contarNodos(raiz);
    }

    private int contarNodos(NodoAVL nodo) {
        if (nodo == null) return 0;
        return 1 + contarNodos(nodo.izquierdo) + contarNodos(nodo.derecho);
    }
}

// ---------- Registro de energia (lectura del sensor) ----------
class RegistroEnergia {
    double voltaje;
    private static final Random RNG = new Random();

    public RegistroEnergia() {
        // Voltaje ficticio entre 110V y 240V, redondeado a 2 decimales
        this.voltaje = Math.round((110 + RNG.nextDouble() * 130) * 100.0) / 100.0;
    }
}

// ---------- Simulacion principal (Tarea 3) ----------
public class SimulacionSmartGrid {

    public static void ejecutarPrueba() {
        ArbolAVLSensores redElectrica = new ArbolAVLSensores();
        final int numSensores = 100_000;

        System.out.println("Iniciando despliegue de " + numSensores + " sensores inteligentes...");

        // Medicion de memoria antes de la carga (estimacion aproximada)
        Runtime runtime = Runtime.getRuntime();
        runtime.gc();
        long memAntes = runtime.totalMemory() - runtime.freeMemory();

        // 1 y 2. Insercion completamente secuencial.
        // En un BST sin auto-balanceo, esta secuencia degenera en una
        // lista enlazada de altura n (peor caso O(n) por busqueda),
        // y en plataformas con recursion profunda puede producir
        // StackOverflowError ("Maximum call stack size exceeded").
        long inicioInsercion = System.nanoTime();
        for (int i = 0; i < numSensores; i++) {
            RegistroEnergia lectura = new RegistroEnergia();
            redElectrica.insertar(i, lectura);
        }
        long finInsercion = System.nanoTime();

        long memDespues = runtime.totalMemory() - runtime.freeMemory();

        System.out.println("Red electrica AVL construida y balanceada con exito.");
        System.out.println("Nodos insertados: " + redElectrica.contarNodos());

        double alturaFinal = redElectrica.alturaTotal();
        double log2n = Math.log(numSensores) / Math.log(2);
        System.out.printf("Altura final del arbol: %.0f  (log2(%d) ~= %.2f)%n",
                alturaFinal, numSensores, log2n);
        System.out.printf("Tiempo total de insercion de %d nodos: %.3f ms%n",
                numSensores, (finInsercion - inicioInsercion) / 1_000_000.0);
        System.out.printf("Memoria aproximada utilizada: %.2f MB%n",
                (memDespues - memAntes) / (1024.0 * 1024.0));

        // 3. Medicion del tiempo de busqueda con precision de nanosegundos
        int idBuscado = 99_999;
        long inicioBusqueda = System.nanoTime();
        NodoAVL resultado = redElectrica.buscar(idBuscado);
        long finBusqueda = System.nanoTime();
        double tiempoMs = (finBusqueda - inicioBusqueda) / 1_000_000.0;

        System.out.println("Sensor encontrado: ID=" +
                (resultado != null ? resultado.idSensor : "no encontrado"));
        System.out.printf("Tiempo de busqueda del Sensor ID %d: %.6f ms.%n", idBuscado, tiempoMs);

        // Comparacion empirica con el caso BST degenerado (O(n))
        System.out.println();
        System.out.println("--- Comparacion teorica con un BST sin balanceo ---");
        System.out.println("BST degenerado (lista enlazada): " + numSensores +
                " comparaciones en el peor caso -> O(n).");
        System.out.printf("Arbol AVL balanceado: %.0f comparaciones en el peor caso -> O(log n).%n",
                alturaFinal);
        System.out.printf("Factor de mejora teorico: ~%.0fx menos comparaciones.%n",
                numSensores / alturaFinal);
    }

    public static void main(String[] args) throws java.io.UnsupportedEncodingException {
        // Forzar salida en UTF-8 para que las tildes se muestren correctamente
        System.setOut(new java.io.PrintStream(System.out, true, "UTF-8"));
        ejecutarPrueba();
    }
}
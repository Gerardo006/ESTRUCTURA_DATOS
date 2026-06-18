// Clase Paquete modificada según la guía
class Paquete {
    int id;

    public Paquete(int id) { 
        this.id = id; 
    }
}

// Clase CentroOperaciones con lógica de búsqueda y validación
class CentroOperaciones {

    // Búsqueda Lineal corregida como arreglo
    public static int buscarLineal(Paquete[] lista, int id) {
        for (int i = 0; i < lista.length; i++) {
            if (lista[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    // Búsqueda Binaria con validación de ordenamiento previo
    public static int buscarBinario(Paquete[] lista, int id) {
        // Validación obligatoria requerida por la guía
        if (!estaOrdenado(lista)) {
            System.out.println("[ALERTA] Error: La lista NO está ordenada. No se puede ejecutar la búsqueda binaria.");
            return -2; // Código de error personalizado para datos desordenados
        }

        int bajo = 0, alto = lista.length - 1;
        while (bajo <= alto) {
            int medio = bajo + (alto - bajo) / 2;
            if (lista[medio].id == id) return medio;
            if (lista[medio].id < id) bajo = medio + 1;
            else alto = medio - 1;
        }
        return -1;
    }

    // Método auxiliar para validar si el arreglo está ordenado
    private static boolean estaOrdenado(Paquete[] lista) {
        for (int i = 1; i < lista.length; i++) {
            if (lista[i - 1].id > lista[i].id) {
                return false; // Encontró un elemento fuera de orden
            }
        }
        return true;
    }
}
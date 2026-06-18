import java.util.Arrays;
import java.util.Random;

public class Main {
    public static void main(String[] args) {
        // 1. Generar conjunto de 10,000 IDs de paquetes aleatorios
        Paquete[] paquetes = new Paquete[10000];
        Random rnd = new Random();
        for (int i = 0; i < 10000; i++) {
            paquetes[i] = new Paquete(rnd.nextInt(100000));
        }

        // Seleccionar el ID del último elemento para simular el peor de los casos en lineal
        int idObjetivo = paquetes[9999].id;

        System.out.println("=== SIMULACIÓN DE RENDIMIENTO (10,000 PAQUETES) ===");
        System.out.println("ID a buscar: " + idObjetivo + "\n");

        // --- 2. PRUEBA DE BÚSQUEDA LINEAL ---
        long inicioLineal = System.nanoTime();
        int posLineal = CentroOperaciones.buscarLineal(paquetes, idObjetivo);
        long finLineal = System.nanoTime();
        double tiempoLineal = (finLineal - inicioLineal) / 1e9;

        System.out.println("-> Búsqueda Lineal:");
        System.out.println("   Resultado (Índice): " + posLineal);
        System.out.println("   Tiempo de ejecución: " + tiempoLineal + " segundos");

        // --- PRUEBA DE VALIDACIÓN (Intento de búsqueda binaria sin ordenar) ---
        System.out.println("\n-> Ejecutando Búsqueda Binaria ANTES de ordenar (Validación):");
        CentroOperaciones.buscarBinario(paquetes, idObjetivo);

        // --- 3. PRUEBA DE BÚSQUEDA BINARIA (INCLUYENDO ORDENAMIENTO) ---
        // Medición del tiempo de ordenamiento
        long inicioOrdenamiento = System.nanoTime();
        Arrays.sort(paquetes, (a, b) -> Integer.compare(a.id, b.id));
        long finOrdenamiento = System.nanoTime();
        double tiempoOrdenamiento = (finOrdenamiento - inicioOrdenamiento) / 1e9;

        // Medición de la búsqueda binaria pura
        long inicioBinario = System.nanoTime();
        int posBinario = CentroOperaciones.buscarBinario(paquetes, idObjetivo);
        long finBinario = System.nanoTime();
        double tiempoBinarioPuro = (finBinario - inicioBinario) / 1e9;

        // Tiempo total requerido por el enfoque logarítmico completo
        double tiempoBinarioTotal = tiempoOrdenamiento + tiempoBinarioPuro;

        System.out.println("\n-> Búsqueda Binaria (Post-ordenamiento):");
        System.out.println("   Resultado (Nuevo Índice): " + posBinario);
        System.out.println("   Tiempo de Ordenamiento previo: " + tiempoOrdenamiento + " segundos");
        System.out.println("   Tiempo de Búsqueda Binaria pura: " + tiempoBinarioPuro + " segundos");
        System.out.println("   Tiempo Total Enfoque Binario: " + tiempoBinarioTotal + " segundos");
    }
}
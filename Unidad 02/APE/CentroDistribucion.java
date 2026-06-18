import java.util.ArrayList;
import java.util.Comparator;

public class CentroDistribucion {

    private ArrayList<Paquete> inventario;

    public CentroDistribucion(int capacidad) {
        inventario = new ArrayList<>(capacidad);
    }

    public void recibirCajaCamion(Paquete p) {
        inventario.add(p);
    }

    public Paquete despacharACliente() {

        if (!inventario.isEmpty()) {
            return inventario.remove(inventario.size() - 1);
        }

        return null;
    }

    public void ordenarRutaRapido() {

        inventario.sort(
            Comparator.comparingInt(
                Paquete::getCodigoPostal
            )
        );
    }
}




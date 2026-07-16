/* ============================================================
   LAB 12 - Indices de Almacenamiento Masivo
   Estructura de Datos - Unidad 3
   Solución completa: Tarea 1 (cálculos), Tarea 2 (TDA Árbol B),
   Tarea 3 (Disk I/O vs RAM) y Caso de Uso (RouterBuffer / MinHeap)
   ============================================================ */


/* ------------------------------------------------------------
   TAREA 1 — Fundamentación matemática y paginación (cálculos)
   ------------------------------------------------------------
   1) Cota superior de la altura h de un Árbol B con n claves y
      grado mínimo t (fórmula clásica de CLRS):

            h <= log_t( (n + 1) / 2 )

   2) Cálculo de ingeniería: página de disco P = 4 KB = 4096 bytes.
      Cada clave (ID paciente) ocupa 8 bytes y cada puntero a hijo
      también ocupa 8 bytes. Un nodo con grado máximo d tiene
      (d - 1) claves y d punteros, por lo tanto:

            d * 8 + (d - 1) * 8 <= 4096
            16d - 8 <= 4096
            d <= (4096 + 8) / 16
------------------------------------------------------------- */

function alturaMaximaArbolB(n, t) {
  // h <= log_t( (n+1)/2 )
  return Math.log((n + 1) / 2) / Math.log(t);
}

function gradoMaximoPorPagina(pageSizeBytes, keySizeBytes, pointerSizeBytes) {
  // d * pointerSize + (d - 1) * keySize <= pageSize
  // d <= (pageSize + keySize) / (pointerSize + keySize)
  const d = (pageSizeBytes + keySizeBytes) / (pointerSizeBytes + keySizeBytes);
  return Math.floor(d);
}

console.log("=== TAREA 1: Cálculo de ingeniería ===");
const PAGE_SIZE = 4096;   // 4 KB
const KEY_SIZE = 8;       // bytes por clave (long / bigint de 64 bits)
const POINTER_SIZE = 8;   // bytes por puntero a hijo

const dMax = gradoMaximoPorPagina(PAGE_SIZE, KEY_SIZE, POINTER_SIZE);
console.log(`Grado máximo d que cabe en una página de ${PAGE_SIZE} bytes: d = ${dMax}`);
console.log(`(cada nodo cabría hasta ${dMax - 1} claves y ${dMax} punteros)\n`);


/* ------------------------------------------------------------
   TAREA 2 — TDA Árbol B (NodoB) en JavaScript ES6+
   ------------------------------------------------------------ */

class NodoB {
  constructor(t, hoja) {
    this.t = t;          // grado mínimo
    this.hoja = hoja;    // ¿es hoja?
    this.claves = [];    // IDs de los pacientes (ordenadas)
    this.hijos = [];     // punteros a subárboles (páginas de disco)
    this.n = 0;           // número actual de claves
  }

  // Búsqueda interna (lineal, ocurre en RAM) + descenso jerárquico (simula Disk I/O)
  buscar(k) {
    let i = 0;
    while (i < this.claves.length && k > this.claves[i]) {
      i++;
    }

    if (i < this.claves.length && this.claves[i] === k) {
      return this;
    }

    if (this.hoja) {
      return null;
    }

    ArbolBPacientes.lecturasDisco++; // cada llamada recursiva a un hijo = 1 lectura de página
    return this.hijos[i].buscar(k);
  }

  // Divide el hijo lleno hijos[i] de este nodo (padre) — operación clásica de inserción CLRS
  dividirHijo(i) {
    const t = this.t;
    const hijoLleno = this.hijos[i];
    const nuevoNodo = new NodoB(t, hijoLleno.hoja);

    nuevoNodo.claves = hijoLleno.claves.splice(t, t - 1);
    const claveMedia = hijoLleno.claves.pop();

    if (!hijoLleno.hoja) {
      nuevoNodo.hijos = hijoLleno.hijos.splice(t, t);
    }

    this.hijos.splice(i + 1, 0, nuevoNodo);
    this.claves.splice(i, 0, claveMedia);
  }

  insertarNoLleno(k) {
    let i = this.claves.length - 1;

    if (this.hoja) {
      while (i >= 0 && k < this.claves[i]) i--;
      this.claves.splice(i + 1, 0, k);
    } else {
      while (i >= 0 && k < this.claves[i]) i--;
      i++;
      if (this.hijos[i].claves.length === 2 * this.t - 1) {
        this.dividirHijo(i);
        if (k > this.claves[i]) i++;
      }
      this.hijos[i].insertarNoLleno(k);
    }
  }
}

class ArbolBPacientes {
  static lecturasDisco = 0; // contador estático compartido por todo el árbol

  constructor(t) {
    this.raiz = null;
    this.t = t;
  }

  buscar(k) {
    return this.raiz ? this.raiz.buscar(k) : null;
  }

  insertar(k) {
    if (!this.raiz) {
      this.raiz = new NodoB(this.t, true);
      this.raiz.claves.push(k);
      return;
    }

    if (this.raiz.claves.length === 2 * this.t - 1) {
      const nuevaRaiz = new NodoB(this.t, false);
      nuevaRaiz.hijos.push(this.raiz);
      nuevaRaiz.dividirHijo(0);
      this.raiz = nuevaRaiz;
    }
    this.raiz.insertarNoLleno(k);
  }
}


/* ------------------------------------------------------------
   TAREA 3 — Evaluación Disk I/O vs RAM (1,000,000 de registros)
   ------------------------------------------------------------ */

console.log("=== TAREA 3: Simulación con 1,000,000 de registros ===");

const N = 1_000_000;
const T = 101; // grado mínimo "grueso", optimizado para disco (nodos de ~200 claves)

const arbolB = new ArbolBPacientes(T);
for (let id = 1; id <= N; id++) {
  arbolB.insertar(id);
}

ArbolBPacientes.lecturasDisco = 0;
const idBuscado = 999_999;
arbolB.buscar(idBuscado);
const lecturasArbolB = ArbolBPacientes.lecturasDisco;

// Altura teórica del Árbol B (cota superior, CLRS): h <= log_t((n+1)/2)
const alturaTeoricaB = Math.ceil(alturaMaximaArbolB(N, T));

// Un AVL tradicional (implícito, sin optimización de página) tiene
// altura ~ log2(n): cada nodo cabe una sola clave por "página" lógica.
const alturaAVL = Math.ceil(Math.log2(N + 1));

console.log(`Árbol B (t = ${T}):`);
console.log(`  - Lecturas de disco reales al buscar la clave ${idBuscado}: ${lecturasArbolB}`);
console.log(`  - Altura teórica máxima (cota superior CLRS): ${alturaTeoricaB}`);
console.log(`AVL tradicional (t = 1 implícito):`);
console.log(`  - Altura aproximada (y por tanto accesos a "disco"): ${alturaAVL}`);
console.log(`Conclusión numérica: el Árbol B necesita aprox. ${alturaTeoricaB} lecturas de disco`);
console.log(`frente a las ${alturaAVL} que necesitaría un AVL tradicional para el mismo 1,000,000 de registros.\n`);


/* ------------------------------------------------------------
   CASO DE USO — RouterBuffer (MinHeap de prioridad por latencia)
   ------------------------------------------------------------ */

class RouterBuffer {
  constructor() {
    this.heap = [];
  }

  push(paquete) { // paquete: {id, latencia} (menor latencia = mayor prioridad)
    this.heap.push(paquete);
    this.bubbleUp();
  }

  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].latencia <= this.heap[index].latencia) break;
      [this.heap[parentIndex], this.heap[index]] =
        [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  pop() { return this.heap.shift(); } // Simplificado para fines académicos
}

console.log("=== CASO DE USO: RouterBuffer (MinHeap) ===");
const router = new RouterBuffer();
router.push({ id: "PKT-1", latencia: 45 });
router.push({ id: "PKT-2", latencia: 12 });
router.push({ id: "PKT-3", latencia: 78 });
router.push({ id: "PKT-4", latencia: 3 });

console.log("Orden de procesamiento (menor latencia primero):");
console.log(router.pop()); // debería salir el de latencia más baja en la raíz
console.log("Heap interno tras un pop:", router.heap);
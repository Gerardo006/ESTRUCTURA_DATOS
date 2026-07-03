// ============================================================
// PREGUNTA 1
// Crear variables e inicializarlas con valores de tipo Boolean, Number,
// BigInt, String y undefined, usando (cuando sea posible) literales
// y funciones constructoras.
// ============================================================

let b1 = true;
let b2 = Boolean(true);

let n1 = 100;
let n2 = Number(200);

let bi1 = 100n;
let bi2 = BigInt(200);

let s1 = "Hello";
let s2 = String("Hello");

let u1 = undefined;
// undefined no tiene función constructora ni forma alternativa: solo existe el literal.


// ============================================================
// PREGUNTA 2
// Imprimir todos los valores y todos los tipos de esos valores usando
// console.log, combinando valor y tipo en una sola llamada mediante
// interpolación de strings.
// ============================================================

console.log("--- Pregunta 2 ---");
console.log(`${b1} [${typeof b1}]`);
console.log(`${b2} [${typeof b2}]`);
console.log(`${n1} [${typeof n1}]`);
console.log(`${n2} [${typeof n2}]`);
console.log(`${bi1} [${typeof bi1}]`);
console.log(`${bi2} [${typeof bi2}]`);
console.log(`${s1} [${typeof s1}]`);
console.log(`${s2} [${typeof s2}]`);
console.log(`${u1} [${typeof u1}]`);


// ============================================================
// PREGUNTA 3
// Realizar una cadena de conversiones: crear un Boolean a partir de un
// BigInt, creado a partir de un Number, creado a partir de un String.
// Empezar con "1234". ¿Es posible?
// Sí, es posible siempre que el string represente un entero válido.
// ============================================================

console.log("--- Pregunta 3 ---");

// Forma compacta (todo en una sola expresión):
let bp3 = Boolean(BigInt(Number("1234")));
console.log(`${bp3} [${typeof bp3}]`);

// Forma expandida (paso a paso), para mayor claridad:
let s = "1234";
let n = Number(s);
let bi = BigInt(n);
let boolFinal = Boolean(bi);
console.log(`${boolFinal} [${typeof boolFinal}]`);

// Nota: BigInt() no acepta números con decimales, por lo que si el string
// tuviera un valor no entero (ej. "12.34"), Number("12.34") -> 12.34,
// y BigInt(12.34) lanzaría un error (RangeError).


// ============================================================
// PREGUNTA 4
// Sumar dos valores del mismo tipo y comprobar el tipo del resultado,
// para todos los tipos primitivos.
// ============================================================

console.log("--- Pregunta 4 ---");

let bSum = true + false;         // !!! el resultado es number, no boolean
let nSum = 100 + 200;
let biSum = 100n + 200n;
let sSum = "He" + "llo";
let uSum = undefined + undefined; // !!! el resultado es number (NaN)

console.log(`${bSum} [${typeof bSum}]`);   // -> 1 [number]
console.log(`${nSum} [${typeof nSum}]`);   // -> 300 [number]
console.log(`${biSum} [${typeof biSum}]`); // -> 300 [bigint]
console.log(`${sSum} [${typeof sSum}]`);   // -> Hello [string]
console.log(`${uSum} [${typeof uSum}]`);   // -> NaN [number]

// Conclusión: al sumar dos Boolean, JS los convierte a Number antes de sumar,
// por lo que el resultado siempre es de tipo number, nunca boolean.
// Al sumar undefined + undefined, ambos se convierten a NaN (number),
// por lo que el resultado también es de tipo number.


// ============================================================
// PREGUNTA 5
// Sumar dos valores de distintos tipos y comprobar los resultados.
// Las líneas comentadas producen TypeError en tiempo de ejecución
// (no se puede mezclar BigInt con Number o Boolean usando el operador +).
// ============================================================

console.log("--- Pregunta 5 ---");

let mb1 = true + 100;        // -> 101 [number]
// let mb2 = true + 100n;     // -> TypeError: Cannot mix BigInt and other types
let mb3 = true + "100";      // -> "true100" [string]

// let mn1 = 100 + 200n;      // -> TypeError: Cannot mix BigInt and other types
let mn2 = 100 + true;        // -> 101 [number]
let mn3 = 100 + "200";       // -> "100200" [string]

// let mbi1 = 100n + 200;     // -> TypeError: Cannot mix BigInt and other types
// let mbi2 = 100n + true;    // -> TypeError: Cannot mix BigInt and other types
let mbi3 = 100n + "200";     // -> "100200" [string]

let ms1 = "100" + 200;       // -> "100200" [string]
let ms2 = "100" + 200n;      // -> "100200" [string]
let ms3 = "100" + true;      // -> "100true" [string]
let ms4 = "abc" + 200;       // -> "abc200" [string]
let ms5 = "abc" + 200n;      // -> "abc200" [string]
let ms6 = "abc" + true;      // -> "abctrue" [string]

console.log(`${mb1} [${typeof mb1}]`);   // -> 101 [number]
console.log(`${mb3} [${typeof mb3}]`);   // -> true100 [string]

console.log(`${mn2} [${typeof mn2}]`);   // -> 101 [number]
console.log(`${mn3} [${typeof mn3}]`);   // -> 100200 [string]

console.log(`${mbi3} [${typeof mbi3}]`); // -> 100200 [string]

console.log(`${ms1} [${typeof ms1}]`);   // -> 100200 [string]
console.log(`${ms2} [${typeof ms2}]`);   // -> 100200 [string]
console.log(`${ms3} [${typeof ms3}]`);   // -> 100true [string]
console.log(`${ms4} [${typeof ms4}]`);   // -> abc200 [string]
console.log(`${ms5} [${typeof ms5}]`);   // -> abc200 [string]
console.log(`${ms6} [${typeof ms6}]`);   // -> abctrue [string]

// Regla general:
// - Si uno de los operandos es string, el resultado es siempre string (concatenación).
// - Si son number/boolean, boolean se convierte a number y se suma numéricamente.
// - BigInt no se puede combinar directamente con number ni boolean (error),
//   pero sí se puede combinar con string (el BigInt se convierte a string).


// ============================================================
// PREGUNTA 6
// Modificar la línea:  const str1 = 42 + "1";
// para obtener el resultado 43 (sin quitar las comillas de "1").
// ============================================================

console.log("--- Pregunta 6 ---");

// El operador unario "+" antes de un string lo convierte a number ANTES
// de que se ejecute la suma, evitando así la concatenación.
const str1 = 42 + +"1";
console.log(`${str1} [${typeof str1}]`); // -> 43 [number]

// Alternativas equivalentes que también funcionan:
const str2 = 42 + Number("1");
console.log(`${str2} [${typeof str2}]`); // -> 43 [number]

const str3 = 42 + parseInt("1", 10);
console.log(`${str3} [${typeof str3}]`); // -> 43 [number]
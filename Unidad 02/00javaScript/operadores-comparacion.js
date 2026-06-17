//OPERADORES DE COMPARACIÓN EN JAVASCRIPT
//Permiten comparar valores y obtener un resultado true o false.


// == igual valor
let numero1 = 10
let numero2 = '10'

console.log(numero1 == numero2) // true


// === igual valor y tipo de dato
let numero3 = 10
let numero4 = '10'

console.log(numero3 === numero4) // false


// != diferente valor
let numero5 = 10
let numero6 = 20

console.log(numero5 != numero6) // true


// !== diferente valor o diferente tipo
let numero7 = 10
let numero8 = '10'

console.log(numero7 !== numero8) // true


// > mayor que
let edad1 = 25
let edad2 = 18

console.log(edad1 > edad2) // true


// < menor que
let temperatura1 = 15
let temperatura2 = 20

console.log(temperatura1 < temperatura2) // true


// >= mayor o igual que
let nota1 = 70
let notaMinima = 70

console.log(nota1 >= notaMinima) // true


// <= menor o igual que
let saldo = 500
let limite = 1000

console.log(saldo <= limite) // true


//COMBINANDO OPERADORES DE COMPARACIÓN CON IF

let edadUsuario = 20

if (edadUsuario >= 18) {
    console.log('Puede ingresar')
}


let notaFinal = 85

if (notaFinal > 90) {
    console.log('Excelente')
} else if (notaFinal >= 70) {
    console.log('Aprobado')
} else {
    console.log('Reprobado')
}


//COMPARACIÓN DE CADENAS

let nombre1 = 'Juan'
let nombre2 = 'Juan'

console.log(nombre1 === nombre2) // true


//COMPARACIÓN DE BOOLEANOS

let activo = true
let bloqueado = false

console.log(activo != bloqueado) // true
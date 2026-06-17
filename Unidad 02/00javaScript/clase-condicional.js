//CONDICIONALES EN JAVASCRIPT
//Permiten tomar decisiones según se cumpla o no una condición.

//if
function verificarEdad() {
    let edad = prompt("Ingresa tu edad:");

    if (edad >= 18) {
        alert("Es mayor de edad");
    } else {
        alert("Es menor de edad");
    }
}

function verificarTemperatura() {
//if - else
let temperatura = 25

if (temperatura >= 20) {
    alert('Hace calor')
} else {
    alert('Hace frío')
}
}


//if - else if - else
let nota = 85

if (nota >= 90) {
    console.log('Excelente')
} else if (nota >= 70) {
    console.log('Aprobado')
} else {
    console.log('Reprobado')
}


//operador ternario
//Forma abreviada de un if-else
let edadUsuario = 20

let mensaje = edadUsuario >= 18
    ? 'Puede ingresar'
    : 'Acceso denegado'

console.log(mensaje)


//switch
//Permite evaluar múltiples casos
let dia = 3

switch (dia) {
    case 1:
        console.log('Lunes')
        break

    case 2:
        console.log('Martes')
        break

    case 3:
        console.log('Miércoles')
        break

    default:
        console.log('Día no válido')
}




let usuario = true
let contraseñaCorrecta = true

if (usuario && contraseñaCorrecta) {
    console.log('Acceso permitido')
}


//condicionales anidadas
let saldo = 500

if (saldo > 0) {
    if (saldo >= 100) {
        console.log('Saldo suficiente')
    }
}

let nombre = 'Fernando'
if (nombre=== 'Fernando') {
    console.log('Hola, Fernando')
} else if (nombre === 'Cristian') {
    console.log('Hola, Cristian')
}else {
    console.log('No encontre tu nombre')
}
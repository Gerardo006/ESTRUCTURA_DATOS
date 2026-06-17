


let expr = "mangos"

switch(expr){
    case "mangos":
        console.log("Los mangos cuestan 5 por $1")
        break;
    case "naranjas":
        console.log("Las naranjas cuestan 10 por $1")
        break;
    case "manzanas":
        console.log("Las manzanas cuestan 5 por $1")
        break;
    default:
        console.log(`Lo siento, no tenemos ${expr} ` )
        break;
}

console.log("¿Quiere comprar algo adicional?")
       
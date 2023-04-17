import bcrypt from "bcrypt"

export function hashear(frase) {
    return bcrypt.hashSync(frase, bcrypt.genSaltSync(10))
}

export function igualarHasheados (recibida,almacenada){
    return bcrypt.compareSync(recibida,almacenada)
}
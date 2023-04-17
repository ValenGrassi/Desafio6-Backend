export class ErrorDeAutenticacion extends Error {
    constructor(mensaje = 'error de autenticacion') {
        super(mensaje);
        this.tipo = 'ERROR_DE_AUTENTICACION';
    }
}
export class ErrorDePermisos extends Error {
    constructor(mensaje = 'error de permisos') {
        super(mensaje);
        this.tipo = 'ERROR_DE_PERMISOS';
    }
}

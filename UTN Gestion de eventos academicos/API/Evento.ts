import { LugarDesarrollo } from "./LugarDesarrollo";
import { Usuario } from "./Usuario";
import { Tag } from "./Tag";

export class Evento{
    nombre: String;
    fecha: Date;
    fechaCierreConvocatoria: Date;
    lugarDesarrollo: LugarDesarrollo;
    tags: Array<Tag>;
    usuarios: Array<Usuario>;
    
    constructor(nombre: String, fecha: Date, fechaCierreConvocatoria: Date, 
        lugarDesarrollo: LugarDesarrollo, tags: Array<Tag>, usuarios: Array<Usuario>){
            this.fecha = fecha;
            this.fechaCierreConvocatoria = fechaCierreConvocatoria;
            this.lugarDesarrollo = lugarDesarrollo;
            this.nombre = nombre;
            this.tags = tags;
            this.usuarios = usuarios;
    }
}
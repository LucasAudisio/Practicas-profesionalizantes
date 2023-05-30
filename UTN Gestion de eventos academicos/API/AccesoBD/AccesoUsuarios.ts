import { Collection, Db } from "mongodb";
import { Usuario } from "../Usuario";
import { createHash } from 'node:crypto';
import { TipoUsuario } from "../TipoUsuario";
function sha256(content: string) {  
    return createHash('sha256').update(content).digest('hex')
}

export class AccesoUsuario{
    url: String;
    database: Db;
    collection: Collection;

    constructor(url: String, database: Db, collection: Collection){
        this.url = url;
        this.database = database;
        this.collection = collection;
    }

    public async getUsuario(nombre: string) {
        const filtro = { nombre: nombre };
        const usuario = await this.collection.findOne(filtro);
        return usuario;
    }

    public async getUsuarios(){
        return await this.collection.find().toArray();
    }

    public async subirUsuario(usuario: Usuario){
        this.collection.insertOne(JSON.parse(JSON.stringify(usuario)));
    }

    public async modificarUsuario(usuario: Usuario){
        const filtro = { nombre: usuario.nombre };
        this.collection.findOneAndReplace(filtro, JSON.parse(JSON.stringify(usuario)));
    }

    public async borrarUsuario(nombre: string){
        //eliminar de la base de datos
        const filtro = { nombre: nombre };
        this.collection.findOneAndDelete(filtro);
    }

    public async buscarUsuarioNuevo(nombreUsuario: string, nombreNuevo: string){
        const usuario = await this.collection.findOne({"nombre": nombreUsuario});
        return await this.collection.find({$and: [{"nombre": {$regex: "e", $options: "i"}}, {"id": {$nin: usuario?.contatctosNombres}}]}).toArray();
    }

    public async registrarse(nombre: string, contraseña: string, correo: string){
        const usuario = new Usuario(correo,sha256(contraseña),nombre, "", TipoUsuario.Usuario)
        await this.collection.insertOne(usuario);
        return usuario;
    }

    public async login(nombre: string, contraseña: string){
        const v = await this.getUsuario(nombre);

        if(v != undefined){
            if(v.contraseña == sha256(contraseña)){
                return "todo bien";
            }
            else{
                return "contraseña incorrecta";
            }
        }
        else{
            return "usuario no encontrado";
        }
    }
}
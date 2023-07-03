import { verificarDominio } from '../verificacionDominio';
import { Router } from 'express';
import { AccesoUsuario } from '../AccesoBD/AccesoUsuarios';
import { Db, MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import { generarClave, verificarClave } from '../jwt';
import { Administrador } from '../Administrador';

// Base de datos
const url: string = "mongodb://127.0.0.1:27017/Gestion-de-eventos-academicos";
const client: MongoClient = new MongoClient(url);
const database: Db = client.db("Gestion-de-eventos-academicos");
var accesoUsuario: AccesoUsuario = new AccesoUsuario(url, database, database.collection("Administrador"))

export function checkAdmin(req: any, res: any, next:any){
    accesoUsuario.getUsuario(req.body.nombreUsuario).then((v) => {
        if(v == undefined){
            res.status(404).send("usuario no encontrado");
            return;
        }
        else{
            next()
        }
    })
}

function checkSuper(req: any, res: any, next:any){
    accesoUsuario.getUsuario(req.body.nombreUsuario).then((v) => {
        if(v == undefined){
            res.status(404).send("usuario no encontrado");
            return;
        }
        else{
            if(v.esSuper){
                next()
            }
            else{
                res.status(400).send("permisos insuficientes");
            }
        }
    })
}

// Enrutador
export const RutasAdmin = Router();

RutasAdmin.use(bodyParser.json());

RutasAdmin.use("/administradores", verificarDominio, checkSuper, verificarClave);
RutasAdmin.use("/superLoginAdministrador", verificarDominio);
RutasAdmin.use("/LoginAdministrador", verificarDominio);

RutasAdmin.post("/superLoginAdministrador", (req, res) => {
    accesoUsuario.getUsuario(req.body.nombre).then((v) => {
        if(v == undefined){
            res.status(400).send("No existe");
            return;
        }
        else if(!v.esSuper){
            res.status(400).send("No es super usuario");
            return;
        }
        else{
            accesoUsuario.login(req.body.nombre, req.body.contraseña).then((b) => {
                if (b) {
                    if (b == "todo bien") {
                        let respuesta: JSON = JSON.parse(JSON.stringify(v));
                        Object.assign(respuesta, { "claveJWT": generarClave(req.body.nombre) });
                        res.json(respuesta);
                    }
                    else {
                        res.status(400).json(v);
                    }
                }
            });
        }
    })
})

RutasAdmin.post("/LoginAdministrador", (req, res) => {
    accesoUsuario.getUsuario(req.body.nombre).then((v) => {
        if(v == undefined){
            res.status(400).send("No existe");
            return;
        }
        else if(v.esSuper){
            res.status(400).send("Es super usuario");
            return;
        }
        else{
            let respuesta: JSON = JSON.parse(JSON.stringify(v));
            Object.assign(respuesta, { "claveJWT": generarClave(req.body.nombre) });
            res.json(respuesta);
        }
    })
})

// Lista admin
RutasAdmin.get("/administradores", (req, res) =>{
    accesoUsuario.getUsuarios().then((v) => {
        res.json(v);
    })
})

// Admin segun nombre
RutasAdmin.get("/administradores/:nombre", (req, res) =>{
    accesoUsuario.getUsuario(req.params.nombre).then((v) => {
        res.json(v);
    })
})

//subir nuevo admin
RutasAdmin.post("/administradores", (req, res) => {
    accesoUsuario.getUsuario(req.body.nombre).then((v) => {
        if (v != undefined) {
            res.send("no se pudo crear, nombre ya en uso");
            return;
        }
        else {
            const usuarioTemp = new Administrador(req.body.nombre, req.body.contraseña, req.body.esSuper)
            accesoUsuario.subirUsuario(usuarioTemp);
            res.json(usuarioTemp);
        }
    })
})

//borrar admin
RutasAdmin.delete("/administradores/:nombre", (req, res) => {
    accesoUsuario.getUsuario(req.params.nombre).then((v) => {
        if (v == undefined) {
            res.send("no existe");
            return;
        }
        else {
            accesoUsuario.borrarUsuario(req.params.nombre);
            res.status(204).send();
        }
    })
})
//modificar todo el usuario
RutasAdmin.put("/administradores/:nombre", (req, res) => {
    accesoUsuario.getUsuario(req.params.nombre).then((v) => {
        if (v == undefined) {
            res.send("no existe");
            return;
        }
        else {
            const usuarioTemp = new Administrador(req.body.nombre, req.body.contraseña, req.body.esSuper);
            usuarioTemp.nombre = v.nombre;
            accesoUsuario.modificarUsuario(usuarioTemp);
            res.json(usuarioTemp);
        }
    })
})

//modificar parte del usuario
RutasAdmin.patch("/administradores/:nombre", (req, res) => {
    accesoUsuario.getUsuario(req.params.nombre).then((v) => {
        if (v == undefined) {
            res.send("no existe");
            return;
        }
        else {
            var usuarioTemp = new Administrador(v.nombre, v.contraseña, v.esSuper);
            if (req.body.contraseña) {
                usuarioTemp.contraseña = req.body.contraseña;
            }
            if (req.body.esSuper) {
                usuarioTemp.esSuper = req.body.esSuper;
            }
            accesoUsuario.modificarUsuario(usuarioTemp);
            res.json(usuarioTemp);
        }
    })
})
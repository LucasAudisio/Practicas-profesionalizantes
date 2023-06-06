import { verificarDominio } from '../verificacionDominio';
import { Router } from 'express';
import { Usuario } from '../Usuario';
import { AccesoUsuario } from '../AccesoBD/AccesoUsuarios';
import { Db, MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import { generarClave, verificarClave } from '../jwt';


const url: string = "mongodb://127.0.0.1:27017/Gestion-de-eventos-academicos";
const client: MongoClient = new MongoClient(url);
const database: Db = client.db("Gestion-de-eventos-academicos");

var accesoUsuario: AccesoUsuario = new AccesoUsuario(url, database, database.collection("Usuario"))

export const RutasUsuarios = Router();

RutasUsuarios.use("/usuarios", verificarDominio, verificarClave)
RutasUsuarios.use("/registrarse", verificarDominio)
RutasUsuarios.use("/login", verificarDominio)

//lista de usuarios
RutasUsuarios.get("/usuarios", (_req,_res) => {
    console.log("se llego")
    accesoUsuario.getUsuarios().then((v)=>{
        _res.send(v);
    })
})
  
//datos del usuario segun id
RutasUsuarios.get("/usuarios/:nombre", (_req,_res) => {
    accesoUsuario.getUsuario(_req.params.nombre).then((v)=>{
        _res.send(v);
    })
})
  
//subir nuevo usuario
RutasUsuarios.post("/usuarios", bodyParser.json(), (_req,_res) => {
    console.log(_req.body)
    accesoUsuario.getUsuario(_req.body.nombre).then((v)=>{
        if(v != undefined){
            _res.send("no se pudo crear");
            return;
        }
        else{
            const usuarioTemp = new Usuario(_req.body.correo,_req.body.contraseña, _req.body.nombre, _req.body.foto, _req.body.tipoUsuario);
            accesoUsuario.subirUsuario(usuarioTemp);
            _res.json(usuarioTemp);
        }
    })
})
  
//borrar usuario
RutasUsuarios.delete("/usuarios/:nombre", (_req,_res) => {
    accesoUsuario.getUsuario(_req.params.nombre).then((v)=>{
        if(v == undefined){
            _res.send("no existe");
            return;
        }
        else{
            accesoUsuario.borrarUsuario(_req.params.nombre);
            _res.status(204).send();
        }
    })
})
//modificar todo el usuario
RutasUsuarios.put("/usuarios/:nombre", (_req,_res) => {
    accesoUsuario.getUsuario(_req.params.nombre).then((v)=>{
        if(v == undefined){
            _res.send("no existe");
            return;
        }
        else{
            const usuarioTemp = new Usuario(_req.body.nombre, _req.body.contra, _req.body.avatar, 
                _req.body.estado, _req.body.contactosNombres);
            accesoUsuario.modificarUsuario(usuarioTemp);
            _res.json(usuarioTemp);
        }
    })
})
RutasUsuarios.patch("/usuarios/:nombre", (_req,_res) => {
    accesoUsuario.getUsuario(_req.params.nombre).then((v)=>{
        if(v == undefined){
            _res.send("no existe");
            return;
        }
        else{
            var usuarioTemp = new Usuario(v.nombre, v.contra, v.avatar, v.estado, v.contactosNombres);
            if(_req.body.correo){
                usuarioTemp.correo = _req.body.correo;
            }
            if(_req.body.contraseña){
                usuarioTemp.contraseña = _req.body.contraseña;
            }
            if(_req.body.fotoPerfil){
                usuarioTemp.fotoPerfil = _req.body.fotoPerfil;
            }
            if(_req.body.tipoUsuario){
                usuarioTemp.tipoUsuario = _req.body.tipoUsuario;
            }
            accesoUsuario.modificarUsuario(usuarioTemp);
            _res.json(usuarioTemp);
        }
    })
})
// Registrarse
RutasUsuarios.post("/registrarse", bodyParser.json(), (_req, _res) => {
    console.log("cuerpo: " + _req.body.contraseña)
    accesoUsuario.getUsuario(_req.body.nombre).then((v) => {
        if(v != undefined){
            _res.send("nombre de usuario ya en uso");
        }
        else{
            accesoUsuario.registrarse(_req.body.nombre, _req.body.contraseña, _req.body.correo).then((b) => {
                _res.json(b);
            })
        }
    })    
})
// Login
RutasUsuarios.post("/login", bodyParser.json(), (_req, _res) => {
    accesoUsuario.getUsuario(_req.body.nombre).then((pedro) => {
        if(pedro){
            accesoUsuario.login(_req.body.nombre, _req.body.contraseña).then((v) => {
                if(v){
                    if(v == "todo bien"){
                        let respuesta: JSON = JSON.parse(JSON.stringify(pedro));
                        Object.assign(respuesta, {"claveJWT": generarClave(_req.body.nombre)});
                        _res.json(respuesta);
                    }
                    else{
                        _res.send(v);
                    }
                }
            });
        }
        else {
            _res.status(404).send();
        }
    })
})
import jwt from "jsonwebtoken";

const claveSecreta = "Utn-Clave"

export function generarClave(nombre: String): string{
    let dataFirma = {
        "nombre": nombre
    }
    let respuesta = jwt.sign(dataFirma, claveSecreta);

    return respuesta;
}
export function verificarClave(req: any, res: any, next: any){
    const clave = req.headers.authorization;

    if (!clave) {
        return res.status(401).send('Unauthorized: No token provided.');
    }

    try {
        jwt.verify(clave, claveSecreta);
        console.log("verificación exitosa");
        next();
    }
    catch (err) {
        return res.status(401).send('Unauthorized: Invalid token.');
    }
}
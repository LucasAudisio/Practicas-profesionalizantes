import express from 'express';
import { RutasUsuarios } from './Controladores/ControladorUsuarios';
import { RutasEventos } from './Controladores/ControladorEventos';
import { createHash } from 'node:crypto';
import { RutasAdmin } from './Controladores/ControladorAdministradores';

const app = express();

const port = 3000;

console.log(createHash('sha256').update("123").digest('hex'))

app.get('/', (_req, _res) => {
    _res.send("API de UTN Gestion de eventos academicos");
});

app.use(RutasUsuarios);
app.use(RutasEventos);
app.use(RutasAdmin);

app.listen(port, () => console.log(`Escuchando en el puerto ${port}!`));
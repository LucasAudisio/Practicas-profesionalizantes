import express from 'express';
import { RutasUsuarios } from './Controladores/ControladorUsuarios';
import { RutasEventos } from './Controladores/ControladorEventos';
const app = express();

const port = 3000;

app.get('/', (_req, _res) => {
    _res.send("API de UTN Gestion de eventos academicos");
});

app.use(RutasUsuarios);
app.use(RutasEventos);

app.listen(port, () => console.log(`Escuchando en el puerto ${port}!`));
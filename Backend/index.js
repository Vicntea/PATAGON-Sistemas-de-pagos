import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import http from 'http';

import {UserControlRouter} from './routes/userControlRoute.js'
import {AuthRouter} from './routes/authRoute.js'
import { RequestsRouter } from './routes/requestsRoute.js';
import { pool } from './middleware/authenticateDB.js';

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


//aplicación
app.use("/api/command", AuthRouter);
app.use("/api/command", RequestsRouter);
app.use("/api/command", UserControlRouter);

// prueba de conexión base de datos
app.get('/test-db', async (req, res) => {
  try{
    const result = await pool.query('SELECT NOW()' );
    res.json({ message: "Conexión establecida"})
  }catch(err){
    res.status(500).json({error: "error de conexion"});
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}/`);
});

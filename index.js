import express from "express";
import cors from "cors";
import authRouter from "./src/routes/auth.routes.js";
import productsRouter from "./src/routes/products.router.js";


//import bodyParser from 'body-parser'; //no usar ya que express superior a 4.16 lo trae nativo ver linea 15
const app = express();
app.use(cors());
app.use(express.json());//aqui utilizamos el bodyparse de express ya que esta integrado, no hace falta intalar npm i body-parse 

// Middleware para parsear JSON
//app.use(bodyParser.json());//no usar ver lineas 7 y 10

//rutas
app.get("/", (req, res) => {
  res.json({ message: "API Rest en Node.js" });
});

app.use("/api",productsRouter);
app.use('/',authRouter);

app.use((req, res, next) => {
  res.status(404).json({ error: "recurso no encontrado, ingrese /login con email y contraseña" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

  const corsOptions = {
    origin: 'http://localhost:3000',  // Cambia esto según tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  };

// Usar CORS y JSON
app.use(cors(corsOptions));
app.use(express.json());



// Rutas
const authRoutes = require("./routes/auth");
const productosRoutes = require("./routes/productos");

// Usar rutas
app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);

// Puerto de servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

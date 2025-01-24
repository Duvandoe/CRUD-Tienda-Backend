const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const router = express.Router();

// Registro de usuario
router.post("/register", async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ msg: "Usuario ya existe" });
    }

    const passwordHash = await bcrypt.hash(contrasena, 10);
    const newUser = new Usuario({ email, contrasena: passwordHash });
    console.log("Datos recibidos en el registro:", req.body);
    console.log("Hash generado:", passwordHash);
    const userSaved = await newUser.save();
    console.log("Usuario guardado en la base de datos:", userSaved);
    const token = jwt.sign({ id: userSaved._id }, "your_secret_key", { expiresIn: "1h" });


res.cookie("token", token);
res.json({
  _id: userSaved._id,
  email: userSaved.email,
});
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

// Login de usuario
router.post("/login", async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    const esContrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esContrasenaValida) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    console.log("Datos recibidos en el login:", req.body);

    const token = jwt.sign({ id: usuario._id }, "your_secret_key", { expiresIn: "1h" });

    res.cookie("token", token);
    res.json({
      token,
      _id: usuario._id,
      email: usuario.email,
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

// Logout de usuario
router.post("/logout", (req, res) => {
  res.clearCookie("token"); // Limpiar la cookie 'token'
  res.json({ msg: "Sesión cerrada correctamente" });
});


module.exports = router;


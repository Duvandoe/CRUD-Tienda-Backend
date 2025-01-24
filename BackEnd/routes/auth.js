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

    // Crear nuevo usuario
    const usuario = new Usuario({ email, contrasena });

    // Encriptar la contraseña antes de guardar
    const salt = await bcrypt.genSalt(10);
    usuario.contrasena = await bcrypt.hash(contrasena, salt);
    console.log('Contraseña encriptada:', usuario.contrasena);

    await usuario.save();
    res.status(201).json({ msg: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

// Login de usuario
router.post("/login", async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    // Comparar la contraseña
    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    console.log('Contraseña ingresada:', contrasena);
    console.log('Contraseña en la base de datos:', usuario.contrasena);
    console.log('Resultado de la comparación:', esValida); // Ver el valor de la comparación

    if (!esValida) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    // Crear y enviar el token JWT
    const token = jwt.sign({ usuarioId: usuario._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error); // Error más detallado
    res.status(500).json({ msg: "Error en el servidor" });
  }
});


module.exports = router;


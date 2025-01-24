const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No se encontró el token" });
  }

  try {
    const tokenVerificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = tokenVerificado.usuarioId;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token no válido" });
  }
};

module.exports = verificarToken;
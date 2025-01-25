const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  // Obtener el token del encabezado Authorization
  const token = req.headers['authorization']?.split(' ')[1];
  // Imprimir el token recibido para ver si es correcto
  console.log("Token recibido:", token);
  // Si no hay token, retornar error
  if (!token) {
    return res.status(401).json({ msg: "Token no proporcionado" });
  }
  try {
    // Decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Imprimir el contenido decodificado del token (lo que contiene el payload)
    console.log("Token decodificado:", decoded);
    // Imprimir el valor de JWT_SECRET para confirmar que la clave secreta está configurada
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    // Agregar los datos del usuario al objeto req para que estén disponibles en la siguiente ruta
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: "Token expirado" });
    }
    res.status(401).json({ msg: "Token inválido" });
  }
};

module.exports = verificarToken;





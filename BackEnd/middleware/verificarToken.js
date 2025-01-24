const jwt = require('jsonwebtoken');
const secretKey = 'tu_clave_secreta'; // Asegúrate de que sea segura y no esté en el código fuente

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extrae el token del header 'Authorization'
  if (!token) {
    return res.status(401).json({ msg: 'No se proporcionó token de autenticación' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: 'Token inválido o expirado' });
    }
    req.user = decoded; // Agregar la información del usuario al request
    next(); // Continuar con la siguiente función (la ruta original)
  });
};

module.exports = verificarToken;

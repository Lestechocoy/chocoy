const cors = require('cors');

// const corsOptions = {
//   origin: '*', // Reemplaza con el dominio de tu aplicación Angular
//   optionsSuccessStatus: 200, // Algunas versiones de CORS tienen esta propiedad
// };

const checkOrigin = (req, res, next) => {
  // const requestOrigin = req.headers.origin;

  // // Verifica si el origen de la solicitud es válido
  // if (requestOrigin === corsOptions.origin) {
  //   // El origen es válido, permite la solicitud
  //   cors(corsOptions)(req, res, next);
  // } else {
  //   // El origen no es válido, retorna un mensaje de error
  //   return res.status(403).json({ error: 'Acceso no permitido desde este origen.' });
  // }

  next();
};

module.exports = checkOrigin;

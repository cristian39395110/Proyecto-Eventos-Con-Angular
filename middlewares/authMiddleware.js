const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "No estás autenticado" });
    }
    next();
  };
  const isOrganizer = (req, res, next) => {
    // Asegúrate de que la sesión esté activa
    if (!req.session || !req.session.userRole) {
      return res.status(401).json({ message: "No estás autenticado" });
    }
  
    // Verifica que el rol del usuario sea "organizador"
    if (req.session.userRole !== "organizador") {
      return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
    }
  
    // Si es organizador, continúa
    next();
  };
  
 
  
  
  module.exports = { isAuthenticated,isOrganizer };
  
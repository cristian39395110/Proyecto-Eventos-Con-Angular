const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'No estás autenticado' });
  }
  next();
};

const isOrganizer = (req, res, next) => {
  console.log(req.session.userRole);
  if (req.session.userRole !== 'organizador') {
    return res.status(403).json({ message: 'No tienes permisos para esta acción' });
  }
  next();
};

  
 
  
  
  module.exports = { isAuthenticated,isOrganizer };
  
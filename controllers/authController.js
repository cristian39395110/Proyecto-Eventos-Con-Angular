const { usuarios } = require("../models/init-models")(require("../database/connection"));
const bcrypt = require("bcrypt");

// Iniciar sesión
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await usuarios.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Verificar la contraseña
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Guardar en la sesión
    req.session.userId = usuario.idUsuario;
    req.session.userRole = usuario.rol;

    // Asegurarte de guardar la sesión
    req.session.save((err) => {
      if (err) {
        console.error("Error al guardar la sesión:", err);
        return res.status(500).json({ message: "Error al iniciar sesión" });
      }

      console.log("Sesión guardada:", req.session);

      res.json({
        message: "Inicio de sesión exitoso",
        usuario: {
          id: usuario.idUsuario,
          nombre: usuario.nombre,
          rol: usuario.rol,
        },
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Cerrar sesión
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "No se pudo cerrar la sesión" });
    }
    res.json({ message: "Sesión cerrada correctamente" });
  });
};

// Verificar sesión activa
const checkSession = (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "No estás autenticado" });
  }
  res.json({ message: "Sesión activa", userId: req.session.userId });
};

module.exports = { login, logout, checkSession };

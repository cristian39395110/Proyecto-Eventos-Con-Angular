const bcrypt = require("bcrypt");
const { usuarios } = require("../models/init-models")(require("../database/connection"));
const { validationResult } = require("express-validator");

// Crear un usuario
const createUsuarioPassword = async (req, res) => {
 
  // Validar los datos recibidos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, email, password, rol } = req.body;
  console.log("createUsuario");
  console.log(password);

  try {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10); // 10 es el saltRounds recomendado

    // Crear el usuario en la base de datos
    const nuevoUsuario = await usuarios.create({
      nombre,
      email,
      password: hashedPassword,
      rol
    });

    res.status(201).json({
      message: "Usuario creado exitosamente",
      usuario: { id: nuevoUsuario.idUsuario, nombre, email, rol }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Obtener todos los usuarios
const getAllUsuarios = async (req, res) => {
    console.log(req.session.userRole);
    try {
      // Verificar si la sesión está activa y contiene el rol
      if (!req.session || !req.session.userRole) {
        return res.status(401).json({ message: "No estás autenticado" });
      }
  
      // Validar si el usuario tiene rol de organizador
      if (req.session.userRole !== "organizador") {
        return res.status(403).json({ message: "Acceso denegado. No tienes permisos suficientes." });
      }
  
      // Obtener todos los usuarios si tiene permiso
      const allUsuarios = await usuarios.findAll();
      res.json(allUsuarios);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
// Obtener un usuario por ID
const getUsuarioById = async (req, res) => {
    try {
        const usuario = await usuarios.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Crear un nuevo usuario
const createUsuario = async (req, res) => {
    try {
        const newUsuario = await usuarios.create(req.body);
        res.status(201).json(newUsuario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Actualizar un usuario
const updateUsuario = async (req, res) => {
    try {
        const usuario = await usuarios.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        await usuario.update(req.body);
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar un usuario
const deleteUsuario = async (req, res) => {
    try {
        const usuario = await usuarios.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        await usuario.destroy();
        res.json({ message: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    createUsuarioPassword
};

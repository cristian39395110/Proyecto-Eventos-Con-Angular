const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const initModels = require("../models/init-models"); // Asegúrate de la ruta correcta
const sequelize = require("../database/connection"); // Conexión a la base de datos
const { isOrganizer } = require("../middlewares/authMiddleware"); // Importa el middleware

const { usuarios } = initModels(sequelize); // Inicializa los modelos

const {
  getAllUsuarios,
  getUsuarioById,
  createUsuarioPassword,
  updateUsuario,
  deleteUsuario,
} = require("../controllers/usuarioController");

// Crear un nuevo usuario con validaciones
router.post(
  "/",
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("email")
      .isEmail().withMessage("El email no tiene un formato válido")
      .custom(async (email) => {
        // Validar si el email ya existe
        const usuarioExistente = await usuarios.findOne({ where: { email } });
        if (usuarioExistente) {
          throw new Error("El email ya está registrado");
        }
      }),
    body("password")
      .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("rol")
      .isIn(["organizador", "asistente"]).withMessage("El rol debe ser organizador o asistente"),
  ],
  async (req, res) => {
    // Validar los datos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Llama al controlador para crear el usuario
    createUsuarioPassword(req, res);
  }
);

// Rutas CRUD para usuarios
router.get("/getAllUsuarios",isOrganizer, getAllUsuarios); // Obtener todos los usuarios
router.get("/:id", getUsuarioById); // Obtener un usuario por ID
router.put("/:id", updateUsuario); // Actualizar un usuario
router.delete("/:id", deleteUsuario); // Eliminar un usuario

module.exports = router;

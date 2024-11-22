const express = require("express");
const { body, validationResult } = require("express-validator");
const { getAllAsistentes, createAsistente } = require("../controllers/asistenteController");

const router = express.Router();

// Obtener todos los asistentes
router.get("/", getAllAsistentes);

// Crear un nuevo asistente con validaciones
router.post(
  "/",
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("email")
      .isEmail().withMessage("El email no tiene un formato válido")
      .notEmpty().withMessage("El email es obligatorio")
      .custom(async (email) => {
        // Validación personalizada para verificar si el email ya existe
        const asistenteExistente = await Asistente.findOne({ where: { email } });
        if (asistenteExistente) {
          throw new Error("El email ya está registrado");
        }
      })
  ],
  async (req, res) => {
    // Manejo de errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Llamar al controlador si las validaciones pasan
    createAsistente(req, res);
  }
);

module.exports = router;

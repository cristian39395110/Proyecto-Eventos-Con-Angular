const express = require("express");
const { body, validationResult } = require("express-validator");
const { getAllEventos, createEvento } = require("../controllers/eventoController");

const router = express.Router();

router.get("/", getAllEventos);

router.post(
  "/",
  [
    body("nombre").notEmpty().withMessage("El nombre del evento es obligatorio"),
    body("fecha")
      .isISO8601().withMessage("La fecha debe tener un formato válido (YYYY-MM-DD)")
      .notEmpty().withMessage("La fecha es obligatoria"),
    body("ubicacion").notEmpty().withMessage("La ubicación del evento es obligatoria")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    createEvento(req, res);
  }
);

module.exports = router;

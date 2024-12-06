const express = require("express");
const { obtenerCertificados } = require("../controllers/certificadoController.js");

const router = express.Router();

// Define la ruta para obtener certificados
router.get('/', obtenerCertificados);

module.exports = router;

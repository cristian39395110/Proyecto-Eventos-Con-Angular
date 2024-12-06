const express = require("express");
const { evento } = require("../models/init-models")(require("../database/connection"));
const { body, validationResult } = require("express-validator");
const {
  getAllEventos,
  getAllEventosOrganizadores,
  crearEvento,
  editarEvento,
  eliminarEvento,
  getUsuariosInscritos,
  marcarAsistencia,
  registrarAsistenciaAnonima,
  anularAsistencia,
} = require("../controllers/eventoController");
const multer = require("multer");
const path = require("path");

// Configurar almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
  },
});

const upload = multer({ storage });

const router = express.Router();

// Ruta para crear evento con imagen
router.post(
  "/",
  upload.single("imagen"), // Middleware para manejar la imagen
  async (req, res) => {
    try {
      const { nombre, fecha, ubicacion, descripcion } = req.body;
      const idOrganizador = req.session?.userId; // Toma el ID del organizador desde la sesión
      const imagen = req.file ? `/uploads/${req.file.filename}` : null;

      if (!nombre || !fecha || !ubicacion) {
        return res.status(400).json({ message: "Los campos nombre, fecha y ubicación son obligatorios." });
      }

      const nuevoEvento = await crearEvento({
        nombre,
        fecha,
        ubicacion,
        descripcion,
        idOrganizador,
        imagen,
      });

      res.status(201).json(nuevoEvento);
    } catch (error) {
      console.error("Error al crear evento:", error.message || error);
      res.status(500).json({ message: "Error al crear el evento." });
    }
  }


);


// Ruta para editar evento con imagen
router.put("/:id", upload.single("imagen"), async (req, res) => {
  const { id } = req.params;
  const { nombre, fecha, ubicacion, descripcion } = req.body;

  try {
    const eventoExistente = await evento.findByPk(id);
    if (!eventoExistente) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Si se subió una nueva imagen, reemplazarla
    const imagen = req.file ? `/uploads/${req.file.filename}` : eventoExistente.imagen;

    await eventoExistente.update({
      nombre,
      fecha: new Date(fecha),
      ubicacion,
      descripcion,
      imagen, // Actualiza la imagen (si se envió una nueva)
    });

    res.json({ message: "Evento actualizado con éxito", evento: eventoExistente });
  } catch (error) {
    console.error("Error al editar el evento:", error);
    res.status(500).json({ message: "Error al editar el evento." });
  }
});

// Otras rutas
router.get("/", getAllEventos);
router.get("/organizador", getAllEventosOrganizadores);
router.get("/:id/usuarios-inscritos", getUsuariosInscritos);
router.put("/:id/marcar-asistencia", marcarAsistencia);
router.post("/:id/registrar-asistencia", registrarAsistenciaAnonima);
router.put("/:id/anular-asistencia", anularAsistencia);
router.put("/:id", editarEvento);
router.delete("/:id", eliminarEvento);

module.exports = router;

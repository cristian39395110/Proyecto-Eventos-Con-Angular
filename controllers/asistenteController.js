const { Asistente } = require('../models/init-models')(require('../database/connection'));

const getAllAsistentes = async (req, res) => {
  try {
    const asistentes = await Asistente.findAll();
    res.json(asistentes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAsistente = async (req, res) => {
  try {
    const asistente = await Asistente.create(req.body);
    res.status(201).json(asistente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllAsistentes, createAsistente };

const { Evento } = require('../models/init-models')(require('../database/connection'));

const getAllEventos = async (req, res) => {
  try {
    const eventos = await Evento.findAll();
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEvento = async (req, res) => {
  try {
    const evento = await Evento.create(req.body);
    res.status(201).json(evento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllEventos, createEvento };

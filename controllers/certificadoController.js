const { evento, asistente, participacion,usuarios } = require("../models/init-models")(require("../database/connection"));

const obtenerCertificados = async (req, res) => {
  const { email } = req.query; // Extrae el correo electrónico de la solicitud
  console.log("Email recibido:", email);

  try {
    // Buscar el asistente usando el correo electrónico
    const asistenteEncontrado = await asistente.findOne({
      where: { email },
      attributes: ['idAsistente'], // Solo necesitamos el id del asistente
    });

    // Verificar si el asistente existe
    if (!asistenteEncontrado) {
      return res.status(404).json({ message: 'No se encontró un asistente con ese correo electrónico.' });
    }

    const idAsistente = asistenteEncontrado.idAsistente;
console.log(idAsistente)
console.log("idAsistente")
    // Buscar participaciones confirmadas del asistente
    const eventosConfirmados = await participacion.findAll({
      where: { confirmacion: true, idAsistente:idAsistente },
      include: [
        {
          model: evento,
          as: 'idEvento_evento',
          attributes: ['nombre', 'descripcion','ubicacion','fecha'], // Atributos que queremos de la tabla eventos
        },
      ],
    });
    console.log("Participaciones confirmadas:", eventosConfirmados);

    // Mapear los datos de los eventos confirmados
    const certificados = eventosConfirmados.map((participacion) => ({
      nombre: participacion.idEvento_evento.nombre,
      fecha: participacion.idEvento_evento.fecha,
      descripcion: participacion.idEvento_evento.descripcion,
      ubicacion:participacion.idEvento_evento.ubicacion,
    }));

    res.json(certificados); // Devolver los certificados en formato JSON
  } catch (err) {

    console.error('Error al obtener certificados:', err);
    res.status(500).json({ message: 'Error al obtener certificados.' });
  }
};

  module.exports = { obtenerCertificados };
  
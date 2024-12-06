const { evento, asistente, participacion,usuarios } = require("../models/init-models")(require("../database/connection"));

const bcrypt = require("bcrypt"); // Importar bcrypt


// Registrar asistencia de usuario no autenticado
const registrarAsistenciaAnonima = async (req, res) => {
  const { id } = req.params; // ID del evento
  const { email,nombre } = req.body; // Correo electrónico enviado en el body
  console.log("id");
  console.log(nombre);
  console.log(email);
  try {
    // Validar que el correo fue enviado
    if (!email) {
      return res.status(400).json({ message: "El correo electrónico es obligatorio." });
    }

    console.log("Correo recibido:", email);

    // Verificar si el evento existe
    const eventoExistente = await evento.findOne({ where: { idEvento: id } });
    if (!eventoExistente) {
      return res.status(404).json({ message: "El evento no existe." });
    }

    console.log("Evento encontrado:", eventoExistente);

    // Buscar o crear el asistente por correo
    let asistenteExistente = await asistente.findOne({ where: { email } });

    if (!asistenteExistente) {
      // Hashear la contraseña (en este caso, el correo)
      const hashedPassword = await bcrypt.hash(email, 10); // 10 rondas de salting

      // Crear el asistente si no existe
      asistenteExistente = await asistente.create({
        email,
        nombre: nombre, // Nombre predeterminado
        password: hashedPassword, // Contraseña hasheada
      });
      console.log("Asistente creado:", asistenteExistente);
    } else {
      console.log("Asistente existente:", asistenteExistente);
    }

    // Verificar si ya está registrado en la tabla participacion
    const participacionExistente = await participacion.findOne({
      where: { idAsistente: asistenteExistente.idAsistente, idEvento: id },
    });

    if (participacionExistente) {
      return res.status(400).json({ message: "Ya estás registrado en este evento." });
    }

    // Crear el registro en la tabla participacion
    await participacion.create({
      idAsistente: asistenteExistente.idAsistente,
      idEvento: id,
      confirmacion: 0, // Confirmación en 0
    });

    console.log("Registro de participación creado.");
    res.status(201).json({ message: "Registro de asistencia creado con éxito." });
  } catch (err) {
    console.error("Error al registrar asistencia anónima:", err);
    res.status(500).json({ error: "Hubo un error al registrar la asistencia." });
  }
};






// Obtener usuarios inscritos en un evento específico
const getUsuariosInscritos = async (req, res) => {
  const { id } = req.params;


  try {
    const usuarios = await participacion.findAll({
      where: { idEvento: id },
      include: [{ model: asistente, as: 'idAsistente_asistente' }]
    });

    const resultado = usuarios.map((usuario) => ({
      idParticipacion: usuario.idParticipacion, // Incluir el ID de participación
      email: usuario.idAsistente_asistente.email,
      confirmacion: usuario.confirmacion
    }));

    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al obtener usuarios inscritos:', error);
    res.status(500).json({ message: 'Error al obtener usuarios inscritos.' });
  }
};
// Obtener todos los eventos
const getAllEventos = async (req, res) => {
  console.log('getAllEventos0');
  try {
    const eventos = await evento.findAll({
      attributes: ['idEvento', 'nombre', 'descripcion', 'fecha', 'ubicacion', 'imagen'], // Asegúrate de incluir 'imagen'
      order: [['fecha', 'ASC']],
    });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getAllEventosOrganizadores = async (req, res) => {
  const userId = req.session?.userId;
 
  if (userId) {
  try {
    // Devuelve los eventos ordenados por fecha ascendente
    const eventos = await evento.findAll({
      order: [['fecha', 'ASC']], // Ordenar por la columna fecha de manera ascendente
    });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }}
  else{
    res.status(500).json({ error: "no tiene permisos" });
  }
};


// Crear un nuevo evento


// Marcar asistencia a un evento
const marcarAsistencia = async (req, res) => {
  const { id } = req.params; // ID del evento
  const userId = req.session?.userId; // ID del usuario logueado extraído de la sesión
  
  console.log("userId:", userId);
  console.log("idEvento:", id);

  try {
    // Validar que el usuario esté logueado
    if (!userId) {
      return res.status(401).json({ message: "No estás autenticado." });
    }

    // Buscar la participación del usuario en el evento
    const participacionExistente = await participacion.findOne({
      where: {  idParticipacion: id },
    });

    if (!participacionExistente) {
      return res.status(404).json({ message: "No estás inscrito en este evento." });
    }

    // Marcar asistencia
    participacionExistente.confirmacion = 1;
    await participacionExistente.save();

    return res.json({ message: "Asistencia marcada con éxito." });
  } catch (err) {
    console.error("Error al marcar asistencia:", err);
    return res.status(500).json({ error: "Hubo un error al marcar la asistencia." });
  }
};

const anularAsistencia =  async (req, res) => {
  const { id } = req.params; // ID del evento
  const userId = req.session?.userId; // ID del usuario logueado extraído de la sesión
  
  console.log("userId:", userId);
  console.log("idEvento:", id);

  try {
    // Validar que el usuario esté logueado
    if (!userId) {
      return res.status(401).json({ message: "No estás autenticado." });
    }

    // Buscar la participación del usuario en el evento
    const participacionExistente = await participacion.findOne({
      where: {  idParticipacion: id },
    });

    if (!participacionExistente) {
      return res.status(404).json({ message: "No estás inscrito en este evento." });
    }

    // Marcar asistencia
    participacionExistente.confirmacion = 0;
    await participacionExistente.save();

    return res.json({ message: "Asistencia Anulada con éxito." });
  } catch (err) {
    console.error("Error al anular asistencia:", err);
    return res.status(500).json({ error: "Hubo un error al marcar la asistencia." });
  }
};
// Obtener usuarios inscritos en un evento específico

// Crear un nuevo evento
const crearEvento = async (datosEvento) => {
  try {
    const { nombre, fecha, ubicacion, descripcion, idOrganizador, imagen } = datosEvento;

    const nuevoEvento = await evento.create({
      nombre: nombre,
      fecha: new Date(fecha),
      ubicacion: ubicacion.trim(),
      descripcion: descripcion.trim(),
      idOrganizador,
      imagen, // Guarda la ruta de la imagen en la base de datos
    });

    return nuevoEvento;
  } catch (err) {
    console.error("Error al crear evento:", err);
    throw err;
  }
};


// Editar un evento existente
const editarEvento = async (req, res) => {
  const { id } = req.params; // ID del evento a editar
  const { nombre, fecha, ubicacion, descripcion } = req.body;

  try {
    const eventoExistente = await evento.findByPk(id);

    if (!eventoExistente) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    await eventoExistente.update({
      nombre,
      fecha,
      ubicacion,
      descripcion,
    });

    res.json({ message: "Evento actualizado con éxito", evento: eventoExistente });
  } catch (err) {
    console.error("Error al editar el evento:", err);
    res.status(500).json({ message: "Error al editar el evento" });
  }
};

// Eliminar un evento existente
const eliminarEvento = async (req, res) => {
  const { id } = req.params;

  try {
    const eventoExistente = await evento.findByPk(id);

    if (!eventoExistente) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Eliminar las participaciones relacionadas
    await eventoExistente.getParticipacions().then(async (participaciones) => {
      for (const participacion of participaciones) {
        await participacion.destroy();
      }
    });

    // Eliminar el evento después de eliminar las participaciones
    await eventoExistente.destroy();

    res.json({ message: "Evento eliminado con éxito" });
  } catch (err) {
    console.error("Error al eliminar el evento:", err);
    res.status(500).json({ message: "Error al eliminar el evento" });
  }
};





module.exports = { getAllEventos,getAllEventosOrganizadores, crearEvento,editarEvento, eliminarEvento,getUsuariosInscritos ,marcarAsistencia,registrarAsistenciaAnonima,anularAsistencia};

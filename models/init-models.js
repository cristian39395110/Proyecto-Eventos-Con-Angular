var DataTypes = require("sequelize").DataTypes;
var _asistente = require("./asistente");
var _evento = require("./evento");
var _participacion = require("./participacion");
var _roles = require("./roles");
var _usuario_rol = require("./usuario_rol");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
  var asistente = _asistente(sequelize, DataTypes);
  var evento = _evento(sequelize, DataTypes);
  var participacion = _participacion(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var usuario_rol = _usuario_rol(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);

  roles.belongsToMany(usuarios, { as: 'idUsuario_usuarios', through: usuario_rol, foreignKey: "idRol", otherKey: "idUsuario" });
  usuarios.belongsToMany(roles, { as: 'idRol_roles', through: usuario_rol, foreignKey: "idUsuario", otherKey: "idRol" });
  participacion.belongsTo(asistente, { as: "idAsistente_asistente", foreignKey: "idAsistente"});
  asistente.hasMany(participacion, { as: "participacions", foreignKey: "idAsistente"});
  participacion.belongsTo(evento, { as: "idEvento_evento", foreignKey: "idEvento"});
  evento.hasMany(participacion, { as: "participacions", foreignKey: "idEvento"});
  usuario_rol.belongsTo(roles, { as: "idRol_role", foreignKey: "idRol"});
  roles.hasMany(usuario_rol, { as: "usuario_rols", foreignKey: "idRol"});
  evento.belongsTo(usuarios, { as: "idOrganizador_usuario", foreignKey: "idOrganizador"});
  usuarios.hasMany(evento, { as: "eventos", foreignKey: "idOrganizador"});
  usuario_rol.belongsTo(usuarios, { as: "idUsuario_usuario", foreignKey: "idUsuario"});
  usuarios.hasMany(usuario_rol, { as: "usuario_rols", foreignKey: "idUsuario"});

  return {
    asistente,
    evento,
    participacion,
    roles,
    usuario_rol,
    usuarios,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

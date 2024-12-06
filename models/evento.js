const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('evento', {
    idEvento: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ubicacion: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    idOrganizador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'idUsuario'
      }
    },
    imagen: {
      type: DataTypes.STRING, // Guardaremos la ruta de la imagen como texto
      allowNull: true,        // Puede ser nulo si no se sube una imagen
    }
  }, {
    sequelize,
    tableName: 'evento',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idEvento" },
        ]
      },
      {
        name: "idOrganizador",
        using: "BTREE",
        fields: [
          { name: "idOrganizador" },
        ]
      }
    ]
  });
};

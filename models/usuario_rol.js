const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuario_rol', {
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'usuarios',
        key: 'idUsuario'
      }
    },
    idRol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'roles',
        key: 'idRol'
      }
    }
  }, {
    sequelize,
    tableName: 'usuario_rol',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idUsuario" },
          { name: "idRol" },
        ]
      },
      {
        name: "idRol",
        using: "BTREE",
        fields: [
          { name: "idRol" },
        ]
      },
    ]
  });
};

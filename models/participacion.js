const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('participacion', {
    idParticipacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idAsistente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'asistente',
        key: 'idAsistente'
      }
    },
    idEvento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'evento',
        key: 'idEvento'
      }
    },
    confirmacion: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'participacion',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idParticipacion" },
        ]
      },
      {
        name: "idAsistente",
        using: "BTREE",
        fields: [
          { name: "idAsistente" },
        ]
      },
      {
        name: "idEvento",
        using: "BTREE",
        fields: [
          { name: "idEvento" },
        ]
      },
    ]
  });
};

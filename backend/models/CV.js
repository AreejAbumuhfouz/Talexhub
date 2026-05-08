'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CV = sequelize.define('CV', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:        { type: DataTypes.UUID, allowNull: false },
  title:         { type: DataTypes.STRING(255) },
  status:        { type: DataTypes.ENUM('uploaded','generated','analysed'), defaultValue: 'uploaded' },
  isPrimary:     { type: DataTypes.BOOLEAN, defaultValue: false },
  fileUrl:       { type: DataTypes.TEXT },
  fileName:      { type: DataTypes.STRING(255) },
  fileSize:      { type: DataTypes.INTEGER },
  fileType:      { type: DataTypes.STRING(50) },
  storageKey:    { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
  parsedContent: { type: DataTypes.JSONB },
  atsScore:      { type: DataTypes.SMALLINT },
  qualityScore:  { type: DataTypes.SMALLINT },
  aiFeedback:    { type: DataTypes.JSONB },
  keywords:      { type: DataTypes.ARRAY(DataTypes.TEXT) },
  builderData:   { type: DataTypes.JSONB },
  language:      { type: DataTypes.STRING(10), defaultValue: 'ar' },
}, {
  tableName: 'cvs',
  indexes: [{ fields: ['user_id'] }, { fields: ['user_id', 'is_primary'] }],
});

module.exports = CV;

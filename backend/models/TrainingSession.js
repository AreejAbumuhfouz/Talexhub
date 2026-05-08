'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrainingSession = sequelize.define('TrainingSession', {
  id:           { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:       { type: DataTypes.UUID, allowNull: false },
  jobId:        { type: DataTypes.UUID },
  title:        { type: DataTypes.STRING(255) },
  questions:    { type: DataTypes.JSONB },
  answers:      { type: DataTypes.JSONB },
  overallScore: { type: DataTypes.DECIMAL(5, 2) },
  aiFeedback:   { type: DataTypes.TEXT },
  durationSecs: { type: DataTypes.INTEGER },
  audioUrl:     { type: DataTypes.TEXT },
  transcript:   { type: DataTypes.TEXT },
  status:       { type: DataTypes.STRING(20), defaultValue: 'in_progress' },
  startedAt:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  completedAt:  { type: DataTypes.DATE },
}, {
  tableName: 'training_sessions',
  updatedAt: false,
});

module.exports = TrainingSession;

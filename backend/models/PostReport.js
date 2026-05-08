'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostReport = sequelize.define('PostReport', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  reporterId: { type: DataTypes.UUID, allowNull: false },
  postId:     { type: DataTypes.UUID },
  commentId:  { type: DataTypes.UUID },
  reason:     { type: DataTypes.STRING(100) },
  details:    { type: DataTypes.TEXT },
  resolved:   { type: DataTypes.BOOLEAN, defaultValue: false },
  resolvedBy: { type: DataTypes.UUID },
}, {
  tableName: 'post_reports',
  updatedAt: false,
});

module.exports = PostReport;

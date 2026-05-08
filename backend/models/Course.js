'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  createdBy:     { type: DataTypes.UUID },
  categoryId:    { type: DataTypes.UUID },
  status:        { type: DataTypes.ENUM('draft','published','archived'), defaultValue: 'draft' },
  title:         { type: DataTypes.STRING(255), allowNull: false },
  titleAr:       { type: DataTypes.STRING(255) },
  description:   { type: DataTypes.TEXT },
  descriptionAr: { type: DataTypes.TEXT },
  thumbnailUrl:  { type: DataTypes.TEXT },
  language:      { type: DataTypes.STRING(10), defaultValue: 'ar' },
  level:         { type: DataTypes.STRING(20), defaultValue: 'beginner' },
  tags:          { type: DataTypes.ARRAY(DataTypes.TEXT) },
  skillsCovered: { type: DataTypes.ARRAY(DataTypes.TEXT) },
  price:         { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  currency:      { type: DataTypes.STRING(10), defaultValue: 'USD' },
  isFree:        { type: DataTypes.BOOLEAN, defaultValue: false },
  discountPct:   { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  enrolledCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  ratingAvg:     { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  ratingCount:   { type: DataTypes.INTEGER, defaultValue: 0 },
  slug:          { type: DataTypes.STRING(500), unique: true },
}, {
  tableName: 'courses',
});

module.exports = Course;

'use strict';

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions:
    process.env.NODE_ENV === 'production'
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
  pool: {
    max:     10,
    min:     2,
    acquire: 30000,
    idle:    10000,
  },
  define: {
    underscored: true,
    timestamps:  true,
    createdAt:   'created_at',
    updatedAt:   'updated_at',
  },
});

module.exports = sequelize;
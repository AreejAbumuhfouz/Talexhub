'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatRoom = sequelize.define('ChatRoom', {
  id:                 { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  categoryId:         { type: DataTypes.UUID },
  createdBy:          { type: DataTypes.UUID },
  name:               { type: DataTypes.STRING(255), allowNull: false },
  nameAr:             { type: DataTypes.STRING(255) },
  description:        { type: DataTypes.TEXT },
  roomType:           { type: DataTypes.ENUM('text','voice','mixed'), defaultValue: 'text' },
  accessType:         { type: DataTypes.ENUM('public','private','paid'), defaultValue: 'public' },
  maxMembers:         { type: DataTypes.INTEGER, defaultValue: 500 },
  freeMinutesPerWeek: { type: DataTypes.INTEGER, defaultValue: 60 },
  paidPricePerHour:   { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
  isPremium:          { type: DataTypes.BOOLEAN, defaultValue: false },
  pricePerAccess:     { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
  isActive:           { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'chat_rooms',
});

module.exports = ChatRoom;

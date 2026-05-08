// 'use strict';

// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const User = sequelize.define('User', {
//   id:                { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
//   email:             { type: DataTypes.STRING(255), allowNull: false, unique: true },
//   emailVerified:     { type: DataTypes.BOOLEAN, defaultValue: false },
//   passwordHash:      { type: DataTypes.TEXT },
//   role:              { type: DataTypes.ENUM('user','company','admin','support','moderator'), defaultValue: 'user' },
//   status:            { type: DataTypes.ENUM('pending','active','suspended','deleted'), defaultValue: 'pending' },
//   fullName:          { type: DataTypes.STRING(255) },
//   phone:             { type: DataTypes.STRING(50) },
//   phoneVerified:     { type: DataTypes.BOOLEAN, defaultValue: false },
//   avatarUrl:         { type: DataTypes.TEXT },
//   headline:          { type: DataTypes.STRING(255) },
//   bio:               { type: DataTypes.TEXT },
//   locationCountry:   { type: DataTypes.STRING(100) },
//   locationCity:      { type: DataTypes.STRING(100) },
//   dateOfBirth:       { type: DataTypes.DATEONLY },
//   gender:            { type: DataTypes.STRING(20) },
//   nationality:       { type: DataTypes.STRING(100) },
//   linkedinUrl:       { type: DataTypes.STRING(500) },
//   portfolioUrl:      { type: DataTypes.STRING(500) },
//   preferredLanguage: { type: DataTypes.STRING(10), defaultValue: 'ar' },
//   desiredJobTitle:   { type: DataTypes.STRING(255) },
//   desiredIndustries: { type: DataTypes.ARRAY(DataTypes.TEXT) },
//   desiredLocations:  { type: DataTypes.ARRAY(DataTypes.TEXT) },
//   desiredSalaryMin:  { type: DataTypes.DECIMAL(12, 2) },
//   desiredSalaryMax:  { type: DataTypes.DECIMAL(12, 2) },
//   desiredJobTypes:   { type: DataTypes.ARRAY(DataTypes.TEXT) },
//   openToWork:        { type: DataTypes.BOOLEAN, defaultValue: true },
//   discoverable:      { type: DataTypes.BOOLEAN, defaultValue: true },
//   twoFaEnabled:      { type: DataTypes.BOOLEAN, defaultValue: false },
//   twoFaSecret:       { type: DataTypes.TEXT },
//   lastLoginAt:       { type: DataTypes.DATE },
//   lastLoginIp:       { type: DataTypes.INET },
//   failedLoginCount:  { type: DataTypes.SMALLINT, defaultValue: 0 },
//   lockedUntil:       { type: DataTypes.DATE },
//   referralCode:      { type: DataTypes.STRING(20), unique: true },
//   googleId:          { type: DataTypes.STRING(100), unique: true, allowNull: true },
//   referredBy:        { type: DataTypes.UUID },
//   deletedAt:         { type: DataTypes.DATE },
// }, {
//   tableName: 'users',
//   paranoid:  true,
//   indexes: [
//     { fields: ['email'] },
//     { fields: ['role', 'status'] },
//     { fields: ['referral_code'] },
//   ],
// });

// module.exports = User;


'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id:                { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email:             { type: DataTypes.STRING(255), allowNull: false, unique: true },
  emailVerified:     { type: DataTypes.BOOLEAN, defaultValue: false },
  passwordHash:      { type: DataTypes.TEXT },
  role:              { type: DataTypes.ENUM('user','company','admin','support','moderator','account manager'), defaultValue: 'user' },
  status:            { type: DataTypes.ENUM('pending','active','suspended','deleted'), defaultValue: 'pending' },
  fullName:          { type: DataTypes.STRING(255) },
  phone:             { type: DataTypes.STRING(50) },
  phoneVerified:     { type: DataTypes.BOOLEAN, defaultValue: false },
  avatarUrl:         { type: DataTypes.TEXT },
  headline:          { type: DataTypes.STRING(255) },
  bio:               { type: DataTypes.TEXT },
  locationCountry:   { type: DataTypes.STRING(100) },
  locationCity:      { type: DataTypes.STRING(100) },
  dateOfBirth:       { type: DataTypes.DATEONLY },
  gender:            { type: DataTypes.STRING(20) },
  nationality:       { type: DataTypes.STRING(100) },
  linkedinUrl:       { type: DataTypes.STRING(500) },
  portfolioUrl:      { type: DataTypes.STRING(500) },
  preferredLanguage: { type: DataTypes.STRING(10), defaultValue: 'ar' },
  desiredJobTitle:   { type: DataTypes.STRING(255) },
  desiredIndustries: { type: DataTypes.ARRAY(DataTypes.TEXT) },
  desiredLocations:  { type: DataTypes.ARRAY(DataTypes.TEXT) },
  desiredSalaryMin:  { type: DataTypes.DECIMAL(12, 2) },
  desiredSalaryMax:  { type: DataTypes.DECIMAL(12, 2) },
  desiredJobTypes:   { type: DataTypes.ARRAY(DataTypes.TEXT) },
  openToWork:        { type: DataTypes.BOOLEAN, defaultValue: true },
  discoverable:      { type: DataTypes.BOOLEAN, defaultValue: true },
  twoFaEnabled:      { type: DataTypes.BOOLEAN, defaultValue: false },
  twoFaSecret:       { type: DataTypes.TEXT },
  lastLoginAt:       { type: DataTypes.DATE },
  lastLoginIp:       { type: DataTypes.INET },
  failedLoginCount:  { type: DataTypes.SMALLINT, defaultValue: 0 },
  lockedUntil:       { type: DataTypes.DATE },
  referralCode:      { type: DataTypes.STRING(20), unique: true },
  googleId:          { type: DataTypes.STRING(100), unique: true, allowNull: true },
  referredBy:        { type: DataTypes.UUID },
  planKey:           { type: DataTypes.STRING(20), defaultValue: 'free' },
  deletedAt:         { type: DataTypes.DATE },
}, {
  tableName: 'users',
  paranoid:  true,
  indexes: [
    { fields: ['email'] },
    { fields: ['role', 'status'] },
    { fields: ['referral_code'] },
  ],
});

module.exports = User;
'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id:               { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  companyId:        { type: DataTypes.UUID, allowNull: false },
  postedBy:         { type: DataTypes.UUID },
  categoryId:       { type: DataTypes.UUID },
  status:           { type: DataTypes.ENUM('draft','pending_approval','active','closed','archived'), defaultValue: 'draft' },
  title:            { type: DataTypes.STRING(255), allowNull: false },
  titleAr:          { type: DataTypes.STRING(255) },
  description:      { type: DataTypes.TEXT, allowNull: false },
  descriptionAr:    { type: DataTypes.TEXT },
  requirements:     { type: DataTypes.TEXT },
  benefits:         { type: DataTypes.TEXT },
  skillsRequired:   { type: DataTypes.ARRAY(DataTypes.TEXT) },
  jobType:          { type: DataTypes.ENUM('full_time','part_time','freelance','internship','remote'), defaultValue: 'full_time' },
  locationCountry:  { type: DataTypes.STRING(100) },
  locationCity:     { type: DataTypes.STRING(100) },
  isRemote:         { type: DataTypes.BOOLEAN, defaultValue: false },
  salaryMin:        { type: DataTypes.DECIMAL(12, 2) },
  salaryMax:        { type: DataTypes.DECIMAL(12, 2) },
  salaryCurrency:   { type: DataTypes.STRING(10), defaultValue: 'USD' },
  salaryVisible:    { type: DataTypes.BOOLEAN, defaultValue: true },
  easyApply:        { type: DataTypes.BOOLEAN, defaultValue: true },
  applicationEmail: { type: DataTypes.STRING(255) },
  applicationUrl:   { type: DataTypes.STRING(500) },
  deadline:         { type: DataTypes.DATEONLY },
  keywords:         { type: DataTypes.ARRAY(DataTypes.TEXT) },
  viewsCount:       { type: DataTypes.INTEGER, defaultValue: 0 },
  applicationsCount:{ type: DataTypes.INTEGER, defaultValue: 0 },
  approvedBy:       { type: DataTypes.UUID },
  approvedAt:       { type: DataTypes.DATE },
  rejectionReason:  { type: DataTypes.TEXT },
  slug:             { type: DataTypes.STRING(500), unique: true },
  closedAt:         { type: DataTypes.DATE },
  deletedAt:        { type: DataTypes.DATE },
}, {
  tableName: 'jobs',
  paranoid:  true,
  indexes: [
    { fields: ['company_id'] },
    { fields: ['status'] },
    { fields: ['category_id'] },
    { fields: ['created_at'] },
  ],
});

module.exports = Job;

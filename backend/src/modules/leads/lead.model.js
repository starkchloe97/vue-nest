import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/index.js';

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'rejected'];

export const Lead = sequelize.define('Lead', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(190), allowNull: false },
  phone: { type: DataTypes.STRING(40), allowNull: false },
  company: { type: DataTypes.STRING(160), allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM(...LEAD_STATUSES), allowNull: false, defaultValue: 'new' },
}, {
  tableName: 'leads',
  timestamps: true,
  underscored: true,
});

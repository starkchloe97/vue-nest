import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/index.js';

export const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(190), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
}, {
  tableName: 'admins',
  timestamps: true,
  underscored: true,
});

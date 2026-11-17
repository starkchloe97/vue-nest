import { Sequelize } from 'sequelize';
import { databaseConfig } from '../config/database.config.js';

export const sequelize = new Sequelize(databaseConfig);

export async function connectDatabase() {
  await sequelize.authenticate();
  console.log('MySQL database connected successfully.');
}
import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('leads', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(190), allowNull: false },
    phone: { type: DataTypes.STRING(40), allowNull: false },
    company: { type: DataTypes.STRING(160), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('new', 'contacted', 'qualified', 'converted', 'rejected'),
      allowNull: false,
      defaultValue: 'new',
    },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });

  await queryInterface.addIndex('leads', ['status'], { name: 'leads_status_idx' });
  await queryInterface.addIndex('leads', ['email'], { name: 'leads_email_idx' });
  await queryInterface.addIndex('leads', ['created_at'], { name: 'leads_created_at_idx' });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('leads');
}

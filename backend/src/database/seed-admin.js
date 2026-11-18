import bcrypt from 'bcrypt';
import { Admin } from '../modules/admins/admin.model.js';
import { sequelize } from './index.js';

async function seedAdmin() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
    throw new Error('Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters) in backend/.env.');
  }

  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existing = await Admin.findOne({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email}. No password changes made.`);
    return;
  }

  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await Admin.create({ name: ADMIN_NAME.trim(), email, password });
  console.log(`Admin created: ${email}`);
}

async function run() {
  try {
    await sequelize.authenticate();
    await seedAdmin();
  } finally {
    await sequelize.close();
  }
}

run().catch((error) => {
  console.error('Admin seeding failed:', error);
  process.exitCode = 1;
});

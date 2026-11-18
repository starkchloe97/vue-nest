import { Umzug, SequelizeStorage } from 'umzug';
import { sequelize } from './index.js';
import * as createAdmins from './migrations/001-create-admins.js';
import * as createLeads from './migrations/002-create-leads.js';

async function migrate() {
  const migrator = new Umzug({
    migrations: [
      { name: '001-create-admins', up: createAdmins.up, down: createAdmins.down },
      { name: '002-create-leads', up: createLeads.up, down: createLeads.down },
    ],
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  try {
    await migrator.up();
    console.log('Database migrations completed.');
  } finally {
    await sequelize.close();
  }
}

migrate().catch((error) => {
  console.error('Database migration failed:', error);
  process.exitCode = 1;
});

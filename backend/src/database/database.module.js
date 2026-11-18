import { Global, Module, Injectable } from '@nestjs/common';
import { sequelize } from './index.js';

@Injectable()
class SequelizeLifecycle {
  async onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    await sequelize.authenticate();
    console.log('MySQL database connected successfully.');
  }

  async onApplicationShutdown() {
    await sequelize.close();
  }
}

@Global()
@Module({
  providers: [SequelizeLifecycle],
  exports: [SequelizeLifecycle],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthController } from './modules/auth/auth.controller.js';
import { LeadsController } from './modules/leads/leads.controller.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController, AuthController, LeadsController],
  providers: [AppService],
})
export class AppModule {}

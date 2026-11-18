import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthController } from './modules/auth/auth.controller.js';
import { LeadsController } from './modules/leads/leads.controller.js';

@Module({
  imports: [
    DatabaseModule,
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 120 }]),
  ],
  controllers: [AppController, AuthController, LeadsController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

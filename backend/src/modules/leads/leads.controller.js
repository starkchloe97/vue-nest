import {
  Bind,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '../auth/auth.guard.js';
import { LeadsService } from './leads.service.js';

@Controller('api/v1/leads')
export class LeadsController {
  constructor() {
    this.leadsService = new LeadsService();
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Bind(Body())
  create(body) {
    return this.leadsService.create(body);
  }

  @Get('stats')
  @UseGuards(AuthGuard)
  getStats() {
    return this.leadsService.getStats();
  }

  @Get()
  @UseGuards(AuthGuard)
  @Bind(Query())
  findAll(query) {
    return this.leadsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Bind(Param('id'))
  findOne(id) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  @Bind(Param('id'), Body('status'))
  updateStatus(id, status) {
    return this.leadsService.updateStatus(id, status);
  }
}

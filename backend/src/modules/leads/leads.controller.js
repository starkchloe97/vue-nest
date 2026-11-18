import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { LeadsService } from './leads.service.js';

@Controller('api/v1/leads')
export class LeadsController {
  constructor() {
    this.leadsService = new LeadsService();
  }

  @Post()
  create(@Body() body) {
    return this.leadsService.create(body);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() query) {
    return this.leadsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  updateStatus(@Param('id') id, @Body('status') status) {
    return this.leadsService.updateStatus(id, status);
  }
}

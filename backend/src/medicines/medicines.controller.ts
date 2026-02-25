import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('search')
  search(@Query('q') query: string) {
    return this.medicinesService.search(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.medicinesService.findAll();
  }
}

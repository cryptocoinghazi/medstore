import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Request() req, @Body() createAppointmentDto: any) {
    return this.appointmentsService.create(req.user.userId, createAppointmentDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.appointmentsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.appointmentsService.findOne(id, req.user.userId);
  }

  @Post(':id/cancel')
  cancel(@Request() req, @Param('id') id: string) {
    return this.appointmentsService.cancel(id, req.user.userId);
  }
}

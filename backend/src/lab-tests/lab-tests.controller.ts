import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { LabTestsService } from './lab-tests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('lab-tests')
export class LabTestsController {
  constructor(private readonly labTestsService: LabTestsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.labTestsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bookings')
  getMyBookings(@Request() req) {
    return this.labTestsService.getMyBookings(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labTestsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('book')
  bookTest(@Request() req, @Body() data: any) {
    return this.labTestsService.bookTest(req.user.userId, data);
  }

  // Admin/Lab only
  @Post()
  create(@Body() data: any) {
    return this.labTestsService.create(data);
  }
}
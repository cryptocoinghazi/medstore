import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  // In production, this should be protected by Admin guard
  @Post()
  create(@Body() createDoctorDto: any) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  findAll(@Query('specialty') specialty?: string, @Query('search') search?: string) {
    return this.doctorsService.findAll({ specialty, search });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }
}

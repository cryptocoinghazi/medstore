
import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  UseGuards, 
  Request, 
  Get,
  Param,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrescriptionsService } from './prescriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPrescription(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.prescriptionsService.uploadPrescription(req.user.userId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserPrescriptions(@Request() req) {
    return this.prescriptionsService.getUserPrescriptions(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPrescription(@Request() req, @Param('id') id: string) {
    return this.prescriptionsService.getPrescriptionById(req.user.userId, id);
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LabTestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // Check if lab exists
    const lab = await this.prisma.diagnosticLab.findUnique({
        where: { id: data.lab_id }
    });
    if (!lab) throw new BadRequestException('Diagnostic Lab not found');

    return this.prisma.labTest.create({
        data: {
            lab_id: data.lab_id,
            name: data.name,
            description: data.description,
            price: data.price,
            duration_hours: data.duration_hours,
            home_collection: data.home_collection,
            preparation_notes: data.preparation_notes,
            is_available: true
        }
    });
  }

  async findAll(query: any) {
    const where: any = { is_available: true };
    if (query.search) {
        where.name = { contains: query.search, mode: 'insensitive' };
    }
    if (query.lab_id) {
        where.lab_id = query.lab_id;
    }

    return this.prisma.labTest.findMany({
        where,
        include: {
            lab: {
                select: { lab_name: true, address: true, is_verified: true }
            }
        },
        orderBy: { created_at: 'desc' }
    });
  }

  async findOne(id: string) {
    const test = await this.prisma.labTest.findUnique({
        where: { id },
        include: {
            lab: true
        }
    });
    if (!test) throw new BadRequestException('Lab Test not found');
    return test;
  }

  async bookTest(patientId: string, data: any) {
    const test = await this.prisma.labTest.findUnique({ where: { id: data.test_id } });
    if (!test) throw new BadRequestException('Lab Test not found');

    // Check availability logic if needed (e.g. slots)
    // For now assume always available for booking

    return this.prisma.testBooking.create({
        data: {
            patient_id: patientId,
            lab_id: test.lab_id,
            test_id: data.test_id,
            booking_date: new Date(data.booking_date),
            time_slot: new Date(data.time_slot),
            home_collection: data.home_collection ?? true,
            address: data.address, // JSON object for address
            status: 'scheduled'
        }
    });
  }

  async getMyBookings(patientId: string) {
      return this.prisma.testBooking.findMany({
          where: { patient_id: patientId },
          include: {
              test: true,
              lab: {
                  include: {
                      user: {
                          select: { mobile: true }
                      }
                  }
              }
          },
          orderBy: { booking_date: 'desc' }
      });
  }
}
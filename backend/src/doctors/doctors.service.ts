import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
        where: { OR: [{ mobile: data.mobile }, { email: data.email }] }
    });
    if (existingUser) {
        throw new BadRequestException('User with this mobile or email already exists');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          role: 'doctor',
          is_verified: true,
        },
      });

      // 2. Create Doctor Profile
      const doctor = await tx.doctor.create({
        data: {
          user_id: user.id,
          specialty: data.specialty,
          license_number: data.license_number,
          experience_years: data.experience_years,
          qualifications: data.qualifications,
          consultation_fee: data.consultation_fee,
          is_available: true,
        },
      });

      return { ...doctor, user };
    });
  }

  async findAll(query?: { specialty?: string; search?: string }) {
    const { specialty, search } = query || {};
    
    const whereClause: any = {
        is_available: true,
    };

    if (specialty) {
        whereClause.specialty = { contains: specialty, mode: 'insensitive' };
    }

    if (search) {
        whereClause.user = {
            name: { contains: search, mode: 'insensitive' }
        };
    }

    return this.prisma.doctor.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            mobile: true,
            address: true, // To show location if needed
          },
        },
      },
      orderBy: {
          specialty: 'asc'
      }
    });
  }

  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            mobile: true,
            address: true,
          },
        },
      },
    });
    
    if (!doctor) throw new BadRequestException('Doctor not found');
    return doctor;
  }
}

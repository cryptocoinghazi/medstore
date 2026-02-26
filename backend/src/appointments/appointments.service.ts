import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(patientId: string, data: any) {
      // Validate doctor exists
      const doctor = await this.prisma.doctor.findUnique({
          where: { id: data.doctor_id }
      });
      if (!doctor) throw new BadRequestException('Doctor not found');

      // Parse dates
      const appointmentDate = new Date(data.appointment_date);
      const timeSlot = new Date(data.time_slot);

      // Check if slot is taken
      // We check for any appointment with same doctor, date and time that is not cancelled
      const existing = await this.prisma.appointment.findFirst({
          where: {
              doctor_id: data.doctor_id,
              appointment_date: appointmentDate,
              time_slot: timeSlot,
              status: { not: 'cancelled' }
          }
      });

      if (existing) {
          throw new BadRequestException('This time slot is already booked');
      }

      return this.prisma.appointment.create({
          data: {
              patient_id: patientId,
              doctor_id: data.doctor_id,
              appointment_date: appointmentDate,
              time_slot: timeSlot,
              consultation_type: data.consultation_type,
              symptoms: data.symptoms,
              notes: data.notes,
              fee: doctor.consultation_fee,
              status: 'scheduled'
          }
      });
  }

  async findAll(patientId: string) {
      return this.prisma.appointment.findMany({
          where: { patient_id: patientId },
          include: {
              doctor: {
                  include: {
                      user: {
                          select: { name: true, mobile: true, address: true }
                      }
                  }
              }
          },
          orderBy: { appointment_date: 'desc' }
      });
  }

  async findOne(id: string, patientId: string) {
      const appointment = await this.prisma.appointment.findFirst({
          where: { id, patient_id: patientId },
          include: {
              doctor: {
                  include: {
                      user: {
                          select: { name: true, mobile: true }
                      }
                  }
              },
              prescriptions: true
          }
      });
      if (!appointment) throw new BadRequestException('Appointment not found');
      return appointment;
  }

  async cancel(id: string, patientId: string) {
      const appointment = await this.prisma.appointment.findFirst({
          where: { id, patient_id: patientId }
      });

      if (!appointment) throw new BadRequestException('Appointment not found');
      if (appointment.status === 'cancelled') throw new BadRequestException('Appointment is already cancelled');
      if (appointment.status === 'completed') throw new BadRequestException('Cannot cancel a completed appointment');

      return this.prisma.appointment.update({
          where: { id },
          data: { status: 'cancelled' }
      });
  }
}

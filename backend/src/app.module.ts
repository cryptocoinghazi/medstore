import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { MedicinesModule } from './medicines/medicines.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { WalletModule } from './wallet/wallet.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { LabTestsModule } from './lab-tests/lab-tests.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    SupabaseModule,
    MedicinesModule,
    CartModule,
    OrdersModule,
    PrescriptionsModule,
    WalletModule,
    DoctorsModule,
    AppointmentsModule,
    LabTestsModule,
  ],
})
export class AppModule {}

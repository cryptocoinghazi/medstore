
import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PrescriptionsService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    const supabase = this.supabaseService.getClient();
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking Supabase buckets:', error);
      return;
    }

    const bucketExists = buckets.find(b => b.name === 'prescriptions');
    if (!bucketExists) {
      console.log("Creating 'prescriptions' bucket...");
      const { error: createError } = await supabase.storage.createBucket('prescriptions', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf']
      });

      if (createError) {
        console.error("Failed to create 'prescriptions' bucket:", createError);
      } else {
        console.log("'prescriptions' bucket created successfully.");
      }
    }
  }

  async uploadPrescription(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // 1. Upload file to Supabase Storage
    const supabase = this.supabaseService.getClient();
    const fileName = `${userId}/${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('prescriptions')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      // Fallback: Check if bucket exists, if not try to create again (just in case)
      if (uploadError.message.includes('Bucket not found')) {
         await this.ensureBucketExists();
         // Retry once
         const { error: retryError } = await supabase.storage
          .from('prescriptions')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });
         if (retryError) {
           throw new BadRequestException('Failed to upload image: ' + retryError.message);
         }
      } else {
        throw new BadRequestException('Failed to upload image: ' + uploadError.message);
      }
    }

    // 2. Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from('prescriptions')
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // 3. Create Prescription Record in DB
    const prescriptionNumber = `RX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    return this.prisma.prescription.create({
      data: {
        patient_id: userId,
        prescription_number: prescriptionNumber,
        image_url: imageUrl,
        type: 'uploaded',
        status: 'pending',
      },
    });
  }

  async getUserPrescriptions(userId: string) {
    return this.prisma.prescription.findMany({
      where: { patient_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getPrescriptionById(userId: string, prescriptionId: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: prescriptionId },
    });

    if (!prescription || prescription.patient_id !== userId) {
      throw new BadRequestException('Prescription not found');
    }

    return prescription;
  }
}

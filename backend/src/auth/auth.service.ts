import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService
  ) {}

  async login(mobile: string, otp: string, role: string) {
    // Implement OTP verification logic here or using Supabase Auth
    // For now, returning a mock response
    
    // Check if user exists in DB
    const user = await this.prisma.user.findUnique({
      where: { mobile },
    });

    if (!user) {
      throw new BadRequestException('User not found. Please register first.');
    }

    const payload = { mobile: user.mobile, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    return { message: 'Login successful', token: token, user: { mobile, role, name: user.name } };
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, mobile: true, role: true, created_at: true },
    });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async register(data: any) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { mobile: data.mobile },
    });

    if (existingUser) {
      throw new BadRequestException('User with this mobile number already exists');
    }

    try {
      // Create user in 'users' table
      const newUser = await this.prisma.user.create({
        data: {
          mobile: data.mobile,
          email: data.email,
          name: data.name,
          role: data.role, // Ensure this matches enum or is validated
          aadhaar: data.aadhaar,
          address: data.address,
          is_verified: false,
        },
      });

      return { message: 'User registered successfully', user: newUser };
    } catch (error) {
      throw new BadRequestException('Registration failed: ' + error.message);
    }
  }
}

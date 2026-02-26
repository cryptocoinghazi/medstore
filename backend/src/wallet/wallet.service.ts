import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { user_id: userId },
      include: {
        transactions: {
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: {
          user_id: userId,
          balance: 0,
        },
        include: {
          transactions: true,
        },
      });
    }

    return wallet;
  }

  async addMoney(userId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // Use a transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      // 1. Get current wallet
      let wallet = await tx.wallet.findUnique({
        where: { user_id: userId },
      });

      if (!wallet) {
        wallet = await tx.wallet.create({
          data: { user_id: userId, balance: 0 },
        });
      }

      // 2. Create transaction record
      await tx.walletTransaction.create({
        data: {
          wallet_id: wallet.id,
          amount: amount,
          type: 'credit',
          category: 'deposit',
          description: 'Added money to wallet',
          status: 'success',
        },
      });

      // 3. Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: amount },
        },
        include: {
          transactions: {
            orderBy: { created_at: 'desc' },
            take: 1, // Return the latest transaction
          },
        },
      });

      return updatedWallet;
    });
  }
}

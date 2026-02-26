import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async getWallet(@Request() req) {
    return this.walletService.getWallet(req.user.userId);
  }

  @Post('add')
  async addMoney(@Request() req, @Body('amount') amount: number) {
    return this.walletService.addMoney(req.user.userId, Number(amount));
  }
}

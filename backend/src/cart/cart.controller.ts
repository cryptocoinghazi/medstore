
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('add')
  addToCart(@Request() req, @Body() body: { medicineId: string; quantity: number }) {
    return this.cartService.addToCart(req.user.userId, body.medicineId, body.quantity || 1);
  }

  @Patch(':itemId')
  updateItem(@Request() req, @Param('itemId') itemId: string, @Body() body: { quantity: number }) {
    return this.cartService.updateItemQuantity(req.user.userId, itemId, body.quantity);
  }

  @Delete(':itemId')
  removeItem(@Request() req, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(req.user.userId, itemId);
  }

  @Delete()
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}

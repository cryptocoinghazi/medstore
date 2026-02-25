
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          include: {
            medicine: true,
          },
          orderBy: {
            added_at: 'desc',
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { user_id: userId },
        include: {
            items: {
                include: { medicine: true }
            }
        }
      });
    }

    // Calculate totals
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + Number(item.medicine.base_price) * item.quantity;
    }, 0);

    return { ...cart, totalAmount };
  }

  async addToCart(userId: string, medicineId: string, quantity: number) {
    if (quantity <= 0) throw new BadRequestException('Quantity must be positive');

    const medicine = await this.prisma.medicine.findUnique({
      where: { id: medicineId },
    });
    if (!medicine) throw new NotFoundException('Medicine not found');

    let cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { user_id: userId },
      });
    }

    // Check if item exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cart_id_medicine_id: {
          cart_id: cart.id,
          medicine_id: medicineId,
        },
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          medicine_id: medicineId,
          quantity,
        },
      });
    }
  }

  async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(userId, itemId);
    }

    // Verify cart ownership
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.cart_id !== cart.id) {
      throw new NotFoundException('Item not found in your cart');
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.cart_id !== cart.id) {
        // Item might already be deleted or doesn't belong to user
        return { message: 'Item removed' }; 
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removed' };
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cart_id: cart.id },
      });
    }
    
    return { message: 'Cart cleared' };
  }
}

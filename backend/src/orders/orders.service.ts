
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, deliveryAddress: any) {
    // 1. Get user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          include: { medicine: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // 2. Calculate total amount
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + Number(item.medicine.base_price) * item.quantity;
    }, 0);

    // 3. Create Order
    // Generate a unique order number (e.g., ORD-TIMESTAMP-RANDOM)
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await this.prisma.order.create({
      data: {
        user_id: userId,
        order_number: orderNumber,
        total_amount: totalAmount,
        status: 'pending',
        delivery_address: deliveryAddress || {}, // Should be validated
        payment_status: 'pending',
        items: {
          create: cart.items.map((item) => ({
            medicine_id: item.medicine_id,
            quantity: item.quantity,
            unit_price: item.medicine.base_price,
            total_price: Number(item.medicine.base_price) * item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: { medicine: true },
        },
      },
    });

    // 4. Clear Cart
    await this.prisma.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });

    return order;
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      include: {
        items: {
          include: { medicine: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { medicine: true },
        },
      },
    });

    if (!order || order.user_id !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}

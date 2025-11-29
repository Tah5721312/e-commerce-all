import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { OrderStatus } from '@prisma/client';

interface OrderItem {
  productId: number;
  productTitle: string;
  productPrice: number;
  quantity: number;
}

interface CreateOrderRequest {
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  totalAmount: number;
  stripePaymentIntentId?: string;
}

function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();
    const { customerInfo, items, totalAmount, stripePaymentIntentId } = body;

    // Validate required fields
    if (!customerInfo || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerAddress: customerInfo.address,
        customerCity: customerInfo.city,
        customerPostalCode: customerInfo.postalCode,
        customerCountry: customerInfo.country,
        totalAmount: totalAmount,
        stripePaymentIntentId: stripePaymentIntentId || null,
        status: OrderStatus.pending,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productTitle: item.productTitle,
            productPrice: item.productPrice,
            quantity: item.quantity,
            subtotal: item.productPrice * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: Number(order.totalAmount),
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create order',
      },
      { status: 500 }
    );
  }
}


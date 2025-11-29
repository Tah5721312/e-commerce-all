import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { OrderStatus } from '@prisma/client';

export async function GET() {
  try {
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));

    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      todayOrders,
      todayRevenue,
    ] = await Promise.all([
      prisma.order.count(),

      prisma.order.count({
        where: { status: OrderStatus.pending }
      }),

      prisma.order.count({
        where: { status: OrderStatus.processing }
      }),

      prisma.order.count({
        where: { status: OrderStatus.shipped }
      }),

      prisma.order.count({
        where: { status: OrderStatus.delivered }
      }),

      prisma.order.count({
        where: { status: OrderStatus.cancelled }
      }),

      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: {
            not: OrderStatus.cancelled,
          },
        },
      }),

      prisma.order.count({
        where: {
          createdAt: {
            gte: startOfDay,
          },
        },
      }),

      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          createdAt: {
            gte: startOfDay,
          },
          status: {
            not: OrderStatus.cancelled,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
        todayOrders,
        todayRevenue: Number(todayRevenue._sum.totalAmount || 0),
      },
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch order stats',
      },
      { status: 500 }
    );
  }
}


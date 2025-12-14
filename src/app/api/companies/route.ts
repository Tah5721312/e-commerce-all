import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';

// GET - Fetch all companies
export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const where = activeOnly ? { isActive: true } : {};

    const companies = await prisma.company.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: companies.map((company) => ({
        ...company,
        productCount: company._count.products,
      })),
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// POST - Create a new company
export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { name, slug, description, email, phone, address, website, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if company with same name or slug already exists
    const existingCompany = await prisma.company.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: 'Company with this name or slug already exists' },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name,
        slug,
        description,
        email,
        phone,
        address,
        website,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      data: company,
    });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}


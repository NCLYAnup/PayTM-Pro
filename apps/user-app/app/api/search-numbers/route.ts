// app/api/search-numbers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth'; // Adjust the path to your authOptions if needed
import prisma from '@repo/db/client';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const numbers = await prisma.user.findMany({
      where: {
        number: {
          contains: q,
        },
      },
      select: {
        number: true,
      },
      take: 10,
    });

    return NextResponse.json(numbers.map(user => user.number));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch numbers' }, { status: 500 });
  }
}

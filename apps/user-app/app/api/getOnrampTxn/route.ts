import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import prisma from '@repo/db/client';

export const GET = async () => {

    const session = await getServerSession(authOptions);


    const txns = await prisma.onRampTransaction.findMany({
      where: {
        userId: Number(session.user.id),
      },
      orderBy: {
        id: 'desc', // Adjust field name if necessary
      },
      take: 1, // Fetch only the last transaction
    });

    if (txns.length > 0) {
        return NextResponse.json(txns[0]); // Return only the first transaction if available
    } else {
        return NextResponse.json({ error: 'No transactions found' });
    }
}


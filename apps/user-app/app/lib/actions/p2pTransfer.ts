"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

interface TransferResponse {
  message: string;
  success: boolean;
}

export async function p2pTransfer(to: string, amount: number): Promise<TransferResponse> {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
      return { message: "User not authenticated", success: false };
    }
    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });
    const fromUser = await prisma.user.findFirst({
      where: {
          id: Number(from)
      }
  });
  const fromBal = await prisma.balance.findUnique({
    where: { userId: Number(from) },
  });

    if (!toUser) {
      return { message: "Recipient user not found", success: false };
    }
    if (from == toUser?.id) {
      return { message: "You cannot send money to yourself", success: false };
  }
  if (!fromBal || fromBal.amount < amount) {
    return { message: 'Insufficient funds', success: false };
  }

 
  try {
    await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`; // lock the specific row so that two request doesn't proceed parralal and user's balance did not become negetive

        const fromBalance = await tx.balance.findUnique({
            where: { userId: Number(from) },
          });
          if (!fromBalance || fromBalance.amount < amount) {
            throw new Error('Insufficient Balance');
          }

          await tx.balance.update({
            where: { userId: Number(from) },
            data: { amount: { decrement: amount } },
          });

          await tx.balance.update({
            where: { userId: toUser.id },
            data: { amount: { increment: amount } },
          });

          await tx.p2pTransfer.create({
            data: {
                fromUserId: Number(from),
                fromUserName: fromUser?.name || "",
                toUserId: toUser.id,
                toUserName: toUser.name || "",
                amount,
                timestamp: new Date()
            }
          });
    });
    return { message: "Transfer successful", success: true };
  } catch (error: any) {
    console.error(error);
    return { message: `Error during transfer: ${error.message}`, success: false };
  }
}
"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return {
            message: "Error while sending"
        }
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


    if (!toUser) {
        {
           throw new Error("User not found")
        }
    }
    if (from == toUser?.id) {
      {
        throw new Error( "you can't send yourself")
      }
  }
    await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`; // lock the specific row so that two request doesn't proceed parralal and user's balance did not become negetive

        const fromBalance = await tx.balance.findUnique({
            where: { userId: Number(from) },
          });
          if (!fromBalance || fromBalance.amount < amount) {
            throw new Error('Insufficient funds');
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
          console.log(toUser.name);
    });
}
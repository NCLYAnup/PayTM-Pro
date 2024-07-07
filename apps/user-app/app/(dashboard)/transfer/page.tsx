import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransaction";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { PrismaClient, OnRampStatus } from "@prisma/client";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    const transactions = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id),
            status: OnRampStatus.Processing,
            processed: false // Only fetch unprocessed transactions
        }
    });
    let updatedBalance = balance;

    const amountToAdd = transactions.reduce((sum, txn) => sum + txn.amount, 0);

    if (transactions.length > 0 && balance) {
        updatedBalance = await prisma.balance.update({
            where: { userId: Number(session?.user?.id) },
            data: {
                locked: { increment: amountToAdd }
            }
        });

        // Mark transactions as processed
        await prisma.onRampTransaction.updateMany({
            where: {
                id: { in: transactions.map(t => t.id) }
            },
            data: {
                processed: true
            }
        });
    }

    return {
        amount: updatedBalance?.amount || 0,
        locked: updatedBalance?.locked || 0
    };
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        },
        orderBy: {
            id: 'desc', // Adjust field name if necessary
          },
          take: 5,
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();

    return <div className="w-full">
    <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transfer
    </div>
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    <div className="md:col-span-2 lg:col-span-2">
            <AddMoney />
        </div>
        <div className="flex flex-col gap-4">
        <div className="p-4">
            <BalanceCard amount={balance.amount} locked={balance.locked} />
            <div className="p-4">
                <OnRampTransactions transactions={transactions} />
            </div>
        </div>
        </div>
    </div>
    </div>

}
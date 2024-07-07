

import prisma from "@repo/db/client";
import { SendCard } from "../../../components/SendCard";
import { P2pTransferHistory } from "../../../components/p2ptransferhistory";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { OnRampTransactions } from "../../../components/OnRampTransaction";

async function getp2ptransfer() {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);
    const p2p = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: userId },
                { toUserId: userId }
            ]
        },
        orderBy: {
            id: 'desc', // Adjust field name if necessary
          }
    });
    return{ p2ptransactions: p2p.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        from: t.fromUserId,
        to:t.toUserId,
        name:t.toUserName || '',
        fromName: t.fromUserName|| ''
    })),
    userId
}
};

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        },
        orderBy: {
            id: 'desc', // Adjust field name if necessary
          }
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function Page() {
    const {p2ptransactions,userId} = await getp2ptransfer();
    const transactions = await getOnRampTransactions();
    return (<div className="w-full">
         <div className="grid grid-cols-1 gap-8 md:grid-cols-3 p-4">
            <div className="col-span-2">
                <OnRampTransactions transactions={transactions} />
            </div>
        <div className="flex flex-col gap-4">
          <P2pTransferHistory p2pTransfers={p2ptransactions} currentUserId={userId}/>
            </div>
             </div>
             </div>
   
    );
}
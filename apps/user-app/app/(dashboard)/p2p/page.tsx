
import prisma from "@repo/db/client";
import { SendCard } from "../../../components/SendCard";
import { P2pTransferHistory } from "../../../components/p2ptransferhistory";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";


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
          },
          take: 7,
    });
    return{ p2ptransactions: p2p.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        from: t.fromUserId,
        to:t.toUserId,
        fromName: t.fromUserName|| '',
        name:t.toUserName|| ''
    })),
    userId
}
};

export default async function Page() {
    const {p2ptransactions,userId} = await getp2ptransfer();
    return (<div className="w-full">
         <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        P2P Transfer
    </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 p-4">
            <div className="col-span-2">
        <SendCard />
        </div>
        <div className="flex flex-col gap-4">
          <P2pTransferHistory p2pTransfers={p2ptransactions} currentUserId={userId}/>
            </div>
             </div>
    </div>
    );
}
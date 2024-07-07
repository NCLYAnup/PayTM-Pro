import { Card } from "@repo/ui/card"

export const P2pTransferHistory = ({
    p2pTransfers,currentUserId
}: {
    p2pTransfers: {
        time: Date,
        amount: number,
        from:number,
        to:number,
        name:string,
        fromName:string
    }[],
    currentUserId: number
}) => {
    if (!p2pTransfers.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
   
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {p2pTransfers.map(t => <div className="flex justify-between">
                <div>
                <div className="text-sm">
                                <span className={t.to === currentUserId ? 'text-black-500' : 'text-black-500'}>
                                    {t.to === currentUserId ? 'Credited' : 'Debited'}
                                </span> INR
                            </div>

                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                    
                    <div>
  {t.to === currentUserId ? (
    <div className="text-slate-600 text-xs text-blue-800">
      {t.fromName}
    </div>
  ) : (
    <div className="text-slate-600 text-xs text-blue-800">
      {t.name}
    </div>
  )}
</div>
                </div>
                <div 
            className={t.to === currentUserId ? 'text-green-500' : 'text-red-500'}
          >
            {t.to === currentUserId ? '+' : '-'} {t.amount/100}
             </div>
            </div>)}
        </div>
    </Card>
}
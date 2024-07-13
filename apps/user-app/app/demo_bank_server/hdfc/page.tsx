import { SendButton } from '../../../components/SendButton'; 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import prisma from '@repo/db/client';


export default async function HdfcPage() {
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
    const paymentAmount = txns.length > 0 && txns[0]?.amount !== undefined ? txns[0]?.amount / 100 : 0;
  return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
      <h1 className="text-2xl font-semibold mb-4 text-center">HDFC Payment</h1>
      <p className="text-gray-700 mb-2 text-center">
        You are making a payment of:
      </p>
      <p className="text-xl font-bold text-center mb-4 text-green-500">
        {paymentAmount}
      </p>
      <p className="text-gray-700 mb-4 text-center">
        Please enter the OTP sent to your registered mobile number to complete the payment.
      </p>
      <SendButton />
    </div>
  </div>
  );
}

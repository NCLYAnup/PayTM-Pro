import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { redirect } from 'next/navigation';
import  UpdateProfile  from "../../../components/UpdateProfile";

export const dynamic = 'force-dynamic';
interface PageProps {
  searchParams: {
    name?: string;
    email?: string;
  };
}




async function Page({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/api/auth/signin');
  }

  const userId = Number(session.user.id);
  const userDetails = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userDetails) {
    return <p>User not found</p>;
  }

  const { name, email } = searchParams;
  if (name && email) {
    const result = await updateUserDetails(userId, name, email);
    if (result.success) {
      redirect('/account');
    }
  }

  return (
       <div className="max-w-2xl mt-5">
      <h1 className="text-3xl font-bold mb-6 text-[#6a51a6]">Update User Details</h1>
      <UpdateProfile userDetails={userDetails} />
    </div>
  );
}

async function updateUserDetails(userId: number, name: string, email: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}

export default Page;


// import prisma from "@repo/db/client";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../lib/auth";
// import { Card } from "@repo/ui/card"

// async function getUserdetails() {
//     const session = await getServerSession(authOptions);
//     const userId = Number(session?.user?.id);
//     const Userdetails = await prisma.user.findUnique({
//         where: {        
            
//             id: userId 
           
//         }
      
//     });
//     return Userdetails;

// };
// export default async function Page() {
//     const  UserDetails = await getUserdetails();
//     return(
//     <Card title="user Information">
//         <div className="pt-2">
//             <div className="flex justify-between">
//                 <div>
//                 <div className="text-sm">
//                 <label className="block text-sm font-medium text-gray-700">Number</label>
//                                {UserDetails?.number}
//                             </div>

//                     <div className="text-slate-600 text-xs">
//                     <label className="block text-sm font-medium text-gray-700">Name</label>
//                         {UserDetails?.name}
//                     </div>
                    
//                     </div>
//                     </div>
//                     </div>
//                     </Card>
//     )
// }
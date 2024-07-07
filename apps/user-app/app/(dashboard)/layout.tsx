"use client"
import { useState } from "react";
import { SidebarItem } from "../../components/SidebarItem";
import { MenuIcon, XIcon } from '@heroicons/react/solid';
import dynamic from 'next/dynamic';

const HomeIcon = dynamic(() => import('@heroicons/react/outline').then(mod => mod.HomeIcon), { ssr: false });
const TransactionsIcon = dynamic(() => import('@heroicons/react/outline').then(mod => mod.ClockIcon), { ssr: false });
const User = dynamic(() => import('@heroicons/react/outline').then(mod => mod.UserCircleIcon), { ssr: false });

export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Backdrop for the sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 bg-white' : '-translate-x-full'}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="pt-8 space-y-4">
          <SidebarItem href="/dashboard" icon={<HomeIcon className="w-6 h-6"/>} title="Home" />
          <SidebarItem href="/transfer" icon={<TransferIcon />} title="Transfer" />
          <SidebarItem href="/transactions" icon={<TransactionsIcon className="w-6 h-6"/>} title="Transactions" />
          <SidebarItem href="/p2p" icon={<P2PTransferIcon />} title="P2P Transfer" />
          <SidebarItem href="/account" icon={<User className="w-6 h-6"/>} title="Account" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex items-center justify-between p-4 bg-gray-800 text-white md:hidden">
          <button onClick={() => setIsSidebarOpen(true)}>
            <MenuIcon className="w-8 h-8" />
          </button>
        </div>
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

// Icons Fetched from https://heroicons.com/
// function HomeIcon() {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
//       <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
//     </svg>
//   );
// }

function TransferIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}

// function TransactionsIcon() {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
//     </svg>
//   );
// }

function P2PTransferIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  );
}

// app/earnings/page.js
"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Eye } from 'lucide-react';

const transactions = [
  {
    id: "INV0938",
    user: "Nothing Studio",
    avatar: "https://i.pravatar.cc/150?u=nothing", // Placeholder
    amount: "$50",
    accNumber: "45484465446",
    date: "Aug, 15 2023 02:29 PM"
  },
  {
    id: "INV0938",
    user: "Nothing Studio",
    avatar: "https://i.pravatar.cc/150?u=nothing", // Placeholder
    amount: "$50",
    accNumber: "45484465446",
    date: "Aug, 15 2023 02:29 PM"
  },
  {
    id: "INV0938",
    user: "Nothing Studio",
    avatar: "https://i.pravatar.cc/150?u=nothing", // Placeholder
    amount: "$50",
    accNumber: "45484465446",
    date: "Aug, 15 2023 02:29 PM"
  }
];

export default function EarningsOverview() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Earnings Overview</h1>
        <div className="flex  rounded-lg overflow-hidden bg-white border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <div className="flex items-center px-3 text-gray-600">
            <Search size={18} />
            <input type="text" placeholder="Search" className="ml-2 outline-none py-2 text-sm " />
          </div>
          {/* <button className="bg-[#0070BA] p-2 text-white border-l">
            <Filter size={20} />
          </button> */}
        </div>
      </div>

      {/* Stats Section */}
      <div className="text-center mb-8">
        <p className="text-gray-500 text-sm">Weekly Revenue <span className="font-bold text-gray-800">$12,322</span></p>
        <button className="mt-2 bg-[#0070BA] text-white px-4 py-1 rounded-full flex items-center mx-auto text-sm gap-2">
          Weekly 
          <span className="text-[10px]">▼</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#0070BA] text-white uppercase text-sm font-semibold">
            <tr>
              <th className="px-6 py-4">Serial</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Acc Number</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {transactions.map((row) => (
              <tr key={row.id} className="border-b border-gray-400 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">{row.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image src={row.avatar} width={32} height={32} className="w-8 h-8 rounded-full border" alt="" />
                    <span className="text-sm font-medium text-gray-700">{row.user}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.amount}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.accNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.date}</td>
                <td className="px-6 py-4">
                  <Link href={`/dashboard/Transporter/earning/${row.id}`}>
                    <button className="text-purple-400 hover:text-purple-600 border border-purple-200 p-1.5 rounded-full">
                      <Eye size={18} />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

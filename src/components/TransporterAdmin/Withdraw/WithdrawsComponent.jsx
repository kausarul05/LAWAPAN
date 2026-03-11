import React, { useState } from 'react';
import Image from 'next/image';

// Withdraws Component
const WithdrawsComponent = ({ onWithdrawClick }) => {
  const balance = 1000; // Example balance

  // More extensive dummy data for withdrawals with amount
  const allWithdrawals = [
    { date: 'Aug 15 2023', amount: '$50.00', status: 'Confirmed' },
    { date: 'Aug 14 2023', amount: '$20.00', status: 'Pending' },
    { date: 'Aug 13 2023', amount: '$100.00', status: 'Confirmed' },
    { date: 'Aug 11 2023', amount: '$75.00', status: 'Confirmed' },
    { date: 'Aug 10 2023', amount: '$30.00', status: 'Pending' },
    { date: 'Aug 09 2023', amount: '$120.00', status: 'Confirmed' },
    { date: 'Aug 08 2023', amount: '$45.00', status: 'Confirmed' },
    { date: 'Aug 07 2023', amount: '$90.00', status: 'Pending' },
    { date: 'Aug 06 2023', amount: '$60.00', status: 'Confirmed' },
    { date: 'Aug 05 2023', amount: '$25.00', status: 'Confirmed' },
    { date: 'Aug 03 2023', amount: '$80.00', status: 'Confirmed' },
    { date: 'Aug 02 2023', amount: '$15.00', status: 'Pending' },
    { date: 'Aug 01 2023', amount: '$55.00', status: 'Confirmed' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of withdrawals per page

  // Calculate total pages
  const totalPages = Math.ceil(allWithdrawals.length / itemsPerPage);

  // Get current withdrawals for the table
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWithdrawals = allWithdrawals.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5; // Maximum number of page buttons to display

    if (totalPages <= maxButtonsToShow) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <span
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded-md cursor-pointer ${
              currentPage === i ? 'bg-[#036BB4] text-white' : 'text-black hover:bg-gray-200'
            }`}
          >
            {i}
          </span>
        );
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

      if (endPage - startPage + 1 < maxButtonsToShow) {
        startPage = Math.max(1, endPage - maxButtonsToShow + 1);
      }

      if (startPage > 1) {
        buttons.push(<span key="1" onClick={() => handlePageChange(1)} className="text-black px-3 py-1 rounded-md hover:bg-gray-200 cursor-pointer">1</span>);
        if (startPage > 2) {
          buttons.push(<span key="dots-start" className="text-black">...</span>);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <span
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded-md cursor-pointer ${
              currentPage === i ? 'bg-[#036BB4] text-white' : 'text-black hover:bg-gray-200'
            }`}
          >
            {i}
          </span>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push(<span key="dots-end" className="text-black">...</span>);
        }
        buttons.push(<span key={totalPages} onClick={() => handlePageChange(totalPages)} className="text-black px-3 py-1 rounded-md hover:bg-gray-200 cursor-pointer">{totalPages}</span>);
      }
    }
    return buttons;
  };

  return (
    <div className="bg-white text-black min-h-screen p-6">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-black">Withdrawals</h2>

        {/* Balance Card */}
        <div className="relative rounded-2xl p-8 mb-8 overflow-hidden ">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none bg-[#036BB4]">
            <Image
              src="/image/withdraws-bg.png"
              alt="Background pattern"
              fill
              className="rounded-2xl opacity-60 object-cover object-center"
            />
          </div>
          {/* Balance Info */}
          <div className="relative z-10">
            <p className="text-white text-sm font-normal mb-2">Your Balance</p>
            <h2 className="text-[40px] font-bold text-white mb-6">${balance}</h2>
            {/* Withdraw Button - Styled as per request */}
            <button
              onClick={onWithdrawClick}
              className="flex flex-col justify-center items-center gap-[8.425px] shrink-0 w-[226px] h-[33px] border border-white rounded-[52px] text-white font-medium hover:bg-white hover:text-teal-600 transition-colors"
              style={{ background: 'linear-gradient(180deg, #036BB4 0%,#036BB4 100%)' }}
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Withdrawal History Table */}
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full rounded-lg">
            <thead>
              <tr className="bg-[#036BB4] text-white text-left">
                <th className="px-4 py-3 rounded-tl-lg text-center">Date</th>
                <th className="px-4 py-3 text-center">Amount</th> {/* Changed from Time to Amount */}
                <th className="px-4 py-3 rounded-tr-lg text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentWithdrawals.map((withdrawal, index) => (
                <tr key={index} className="border-b border-gray-300 last:border-b-0">
                  <td className="px-4 py-3 text-black text-center">{withdrawal.date}</td>
                  <td className="px-4 py-3 text-black text-center">{withdrawal.amount}</td> {/* Displaying amount */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        withdrawal.status === 'Confirmed' ? 'text-[#71F50C]' :
                        withdrawal.status === 'Pending' ? 'text-[#FB6000]' :
                        'text-red-600' // For 'Failed' status
                      }`}
                    >
                      {withdrawal.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
      </div>
      <div className="flex justify-end items-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded-full text-[#036BB4] border border-[#036BB4] hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Left Arrow Icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        {renderPaginationButtons()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded-full border border-[#036BB4] text-[#036BB4] hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Right Arrow Icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WithdrawsComponent;
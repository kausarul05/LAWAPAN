"use client";
import React, { useState } from 'react';

const WithdrawRequestComponent = ({ onBack }) => {
  const [amount, setAmount] = useState('2000'); // Example default amount
  const [region, setRegion] = useState(''); // Example default region
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic here
    console.log('Withdraw Request Submitted:', { amount, region });
    // You might want to navigate back to WithdrawsComponent after submission
    // onBack();
  };

  return (
    // Main container with white background and black text
    <div className="bg-white text-black min-h-screen p-6 rounded-lg shadow-lg">
      {/* Header section with back button and title */}
      <div className="flex items-center mb-6">
        {/* Back button with adjusted text and hover colors for white background */}
        <button
          onClick={onBack}
          className="p-2 mr-2 text-gray-700 hover:text-black transition-colors duration-200 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
        >
          {/* Back Arrow Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        {/* Title for the withdraw request form */}
        <h2 className="text-2xl font-bold text-black">Withdraw Request</h2>
      </div>

      {/* Withdrawal request form */}
      <form onSubmit={handleSubmit}>
        {/* Amount input field */}
        <div className="mb-6">
          <label htmlFor="amount" className="block text-black text-sm mb-2">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            // Corrected className: removed the JavaScript comment inside the string
            className="w-full border border-gray-300 text-black rounded-lg py-3 px-4 focus:outline-none focus:border-teal-500 bg-white"
            placeholder="Enter amount"
            required
          />
        </div>

        {/* Region dropdown field */}
        <div className="mb-8 relative">
          <label htmlFor="region" className="block text-black text-sm mb-2">
            Region
          </label>
          <div className="relative">
            {/* Dropdown toggle button */}
            <button
              type="button"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-left text-black focus:outline-none focus:border-teal-500 flex justify-between items-center bg-white"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {region ? region : 'Your Region'}
              {/* Dropdown arrow icon */}
              <svg className="fill-current h-5 w-5 ml-2 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </button>
            {/* Dropdown options */}
            {showDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {[
                  { value: '', label: 'Your Region', disabled: true },
                  { value: 'usa', label: 'USA' },
                  { value: 'canada', label: 'Canada' },
                  { value: 'europe', label: 'Europe' },
                  { value: 'asia', label: 'Asia' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    disabled={opt.disabled}
                    onClick={() => {
                      if (!opt.disabled) {
                        setRegion(opt.label);
                        setShowDropdown(false);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 transition-all ${
                      opt.disabled
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'hover:bg-gray-100 hover:text-black text-gray-800 cursor-pointer'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit button */}
        <div className="col-span-full mt-4">
          <button
            type="submit"
            className="w-full mx-auto flex justify-center items-center rounded-full bg-[#036BB4] text-white py-2 font-medium "
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default WithdrawRequestComponent;
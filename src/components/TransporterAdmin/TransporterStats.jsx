"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MonthDropdown = ({ month, setMonth, show, setShow }) => (
  <div className="relative">
    <button
      onClick={() => setShow(!show)}
      className="flex items-center gap-1.5 px-3 py-1 text-white rounded-full text-xs font-medium transition-colors"
      style={{backgroundColor: '#036BB4'}}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#025191'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#036BB4'}
    >
      {month}
      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${show ? 'rotate-180' : ''}`} />
    </button>
    
    {show && (
      <>
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShow(false)}
        />
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[130px] max-h-[280px] overflow-y-auto">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => {
                setMonth(m);
                setShow(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                m === month ? 'font-medium' : 'text-gray-700'
              }`}
              style={m === month ? {backgroundColor: '#f0f7ff', color: '#036BB4'} : {}}
            >
              {m}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
);

const TransporterStats = () => {
  const [progressMonth, setProgressMonth] = useState('January');
  const [completedMonth, setCompletedMonth] = useState('January');
  const [earningsMonth, setEarningsMonth] = useState('January');
  
  const [showProgressDropdown, setShowProgressDropdown] = useState(false);
  const [showCompletedDropdown, setShowCompletedDropdown] = useState(false);
  const [showEarningsDropdown, setShowEarningsDropdown] = useState(false);

  // Sample data for different months
  const statsData = {
    'January': { progress: 4, completed: 20, earnings: 200 },
    'February': { progress: 6, completed: 18, earnings: 250 },
    'March': { progress: 3, completed: 22, earnings: 280 },
    'April': { progress: 5, completed: 19, earnings: 220 },
    'May': { progress: 7, completed: 25, earnings: 300 },
    'June': { progress: 4, completed: 21, earnings: 240 },
    'July': { progress: 8, completed: 23, earnings: 290 },
    'August': { progress: 5, completed: 20, earnings: 260 },
    'September': { progress: 6, completed: 24, earnings: 270 },
    'October': { progress: 4, completed: 22, earnings: 230 },
    'November': { progress: 7, completed: 26, earnings: 310 },
    'December': { progress: 5, completed: 21, earnings: 250 }
  };

  return (
    <div className="flex gap-5 p-6 bg-gray-50">
      {/* Shipments in progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-1 min-w-[280px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 text-sm font-medium">Shipments in progress</h3>
          <MonthDropdown 
            month={progressMonth}
            setMonth={setProgressMonth}
            show={showProgressDropdown}
            setShow={setShowProgressDropdown}
          />
        </div>
        <p className="text-4xl font-bold text-gray-900">{statsData[progressMonth].progress}</p>
      </div>

      {/* Completed shipments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-1 min-w-[280px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 text-sm font-medium">Completed shipments</h3>
          <MonthDropdown 
            month={completedMonth}
            setMonth={setCompletedMonth}
            show={showCompletedDropdown}
            setShow={setShowCompletedDropdown}
          />
        </div>
        <p className="text-4xl font-bold text-gray-900">{statsData[completedMonth].completed}</p>
      </div>

      {/* Total Earnings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-1 min-w-[280px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 text-sm font-medium">Total Earnings</h3>
          <MonthDropdown 
            month={earningsMonth}
            setMonth={setEarningsMonth}
            show={showEarningsDropdown}
            setShow={setShowEarningsDropdown}
          />
        </div>
        <p className="text-4xl font-bold text-gray-900">{statsData[earningsMonth].earnings}</p>
      </div>
    </div>
  );
};

export default TransporterStats;

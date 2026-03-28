"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDown, Loader } from 'lucide-react';
import { getTransporterStats } from '@/components/lib/apiClient';

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
  const [progressMonth, setProgressMonth] = useState('March');
  const [completedMonth, setCompletedMonth] = useState('March');
  const [earningsMonth, setEarningsMonth] = useState('March');
  
  const [showProgressDropdown, setShowProgressDropdown] = useState(false);
  const [showCompletedDropdown, setShowCompletedDropdown] = useState(false);
  const [showEarningsDropdown, setShowEarningsDropdown] = useState(false);
  
  const [stats, setStats] = useState({
    shipmentsInProgress: 0,
    completedShipments: 0,
    totalEarnings: 0,
    selectedMonth: { month: 'March', year: 2026 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get transporter ID from localStorage
  const getTransporterId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('transporter_id');
    }
    return null;
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const transporterId = getTransporterId();
      if (!transporterId) {
        throw new Error('Transporter ID not found. Please login again.');
      }
      
      console.log('🔍 Fetching stats for transporter:', transporterId);
      
      const response = await getTransporterStats(transporterId);
      
      console.log('📦 Stats response:', response);

      if (response.success && response.data) {
        setStats({
          shipmentsInProgress: response.data.shipmentsInProgress || 0,
          completedShipments: response.data.completedShipments || 0,
          totalEarnings: response.data.totalEarnings || 0,
          selectedMonth: response.data.selectedMonth || { month: 'March', year: 2026 }
        });
        
        // Update months based on API response
        const apiMonth = response.data.selectedMonth?.month || 'March';
        setProgressMonth(apiMonth);
        setCompletedMonth(apiMonth);
        setEarningsMonth(apiMonth);
      } else {
        throw new Error(response.message || 'Failed to fetch stats');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
      
      // If unauthorized, redirect to login
      if (err.message.includes('Session expired') || err.message.includes('401')) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // Load stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-5 p-6 bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-1 min-w-[280px] flex items-center justify-center">
          <Loader className="w-6 h-6 animate-spin text-[#036BB4]" />
          <span className="ml-2 text-gray-600">Loading stats...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-5 p-6 bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-1 min-w-[280px] text-center">
          <p className="text-red-500 mb-2">⚠️ {error}</p>
          <button 
            onClick={fetchStats}
            className="px-4 py-2 bg-[#036BB4] text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
        <p className="text-4xl font-bold text-gray-900">{stats.shipmentsInProgress}</p>
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
        <p className="text-4xl font-bold text-gray-900">{stats.completedShipments}</p>
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
        <p className="text-4xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default TransporterStats;
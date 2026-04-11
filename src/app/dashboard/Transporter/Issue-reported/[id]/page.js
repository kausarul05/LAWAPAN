"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getIssueDetails } from '../../../../../components/lib/apiClient';

// Helper function to replace localhost URLs with server URL
const replaceImageUrl = (url) => {
  if (!url) return null;
  return url.replace('http://localhost:5000', 'https://server.lawapantruck.com');
};

const ReportedIssueDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Issue ID:", id);

  // Fetch issue details
  const fetchIssueDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching issue details for ID:', id);
      
      const response = await getIssueDetails(id);
      
      console.log('📦 Issue details response:', response);

      if (response.success && response.data) {
        const issueData = response.data;
        
        setIssue({
          id: issueData._id,
          issueId: `#${issueData._id?.slice(-8) || 'N/A'}`,
          status: issueData.status || 'Pending',
          title: issueData.issue_title || issueData.title || 'N/A',
          shipmentId: issueData.shipment_id?.slice(-8) || issueData.shipmentId || 'N/A',
          fullShipmentId: issueData.shipment_id,
          transporter: issueData.transporter_name || issueData.transporter || 'N/A',
          reportedOn: issueData.reported_on || issueData.createdAt,
          description: issueData.issue_description || issueData.description || issueData.discription || 'N/A',
          createdAt: issueData.createdAt,
          updatedAt: issueData.updatedAt,
          resolved_at: issueData.resolved_at
        });
      } else {
        throw new Error(response.message || 'Failed to fetch issue details');
      }
    } catch (err) {
      console.error('❌ Error fetching issue details:', err);
      setError(err.message);
      
      // If unauthorized, redirect to login
      if (err.message.includes('Session expired') || err.message.includes('401')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchIssueDetails();
    }
  }, [id]);

  // Get status color
  // const getStatusColor = (status) => {
  //   const statusLower = (status || '').toLowerCase();
  //   if (statusLower.includes('pending') || statusLower.includes('open')) {
  //     return 'bg-[#FF5C00]';
  //   } else if (statusLower.includes('resolved') || statusLower.includes('closed')) {
  //     return 'bg-green-600';
  //   } else if (statusLower.includes('in progress')) {
  //     return 'bg-blue-600';
  //   }
  //   return 'bg-gray-600';
  // };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-[#F4F7FA] min-h-screen p-6 font-sans flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#036BB4] mx-auto mb-4" />
          <p className="text-gray-600">Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="bg-[#F4F7FA] min-h-screen p-6 font-sans">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Issue Summary</h1>
        </div>

        {/* Error Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-8 text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-800 mb-4">{error || 'Issue not found'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#036BB4] text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F7FA] min-h-screen p-6 font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-blue-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Issue Summary</h1>
      </div>

      {/* Detail Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="flex justify-between items-center px-8 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Issue ID {issue.issue_id}</h2>
          <div className={`flex items-center gap-2 ${issue.status} text-white px-3 py-1 rounded-full text-[10px] font-bold`}>
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            {issue.status}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <section className="space-y-1">
              <label className="text-sm text-gray-400 font-medium">Issue Title</label>
              <p className="text-gray-800 font-bold text-base">{issue.title}</p>
            </section>

            <section className="space-y-1">
              <label className="text-sm text-gray-400 font-medium">Shipment Id</label>
              <p className="text-gray-800 font-bold text-base">{issue.shipmentId}</p>
              {issue.fullShipmentId && (
                <p className="text-xs text-gray-400 mt-1">Full ID: {issue.fullShipmentId}</p>
              )}
            </section>

            <section className="space-y-1">
              <label className="text-sm text-gray-400 font-medium">Transporter</label>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-5 h-5 rounded-full bg-blue-50 border border-gray-100 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-blue-600">
                    {issue.transporter?.charAt(0) || 'T'}
                  </span>
                </div>
                <p className="text-gray-800 font-bold text-sm">{issue.transporter}</p>
              </div>
            </section>

            <section className="space-y-1">
              <label className="text-sm text-gray-400 font-medium">Reported On</label>
              <p className="text-gray-800 font-bold text-base">
                {formatDate(issue.reported_on)}
                {issue.reported_on && ` at ${formatTime(issue.reported_on)}`}
              </p>
            </section>

            <section className="space-y-1">
              <label className="text-sm text-gray-400 font-medium">Issue Description</label>
              <p className="text-gray-800 font-bold text-base leading-relaxed">{issue.description}</p>
            </section>

            {/* Resolution Details (if resolved) */}
            {issue.resolved_at && (
              <section className="space-y-1 pt-4 border-t border-gray-100">
                <label className="text-sm text-green-600 font-medium">Resolved On</label>
                <p className="text-gray-800 font-bold text-base">
                  {formatDate(issue.resolved_at)} at {formatTime(issue.resolved_at)}
                </p>
              </section>
            )}

            {/* Timestamps */}
            {/* <div className="pt-6 text-xs text-gray-400 flex justify-between border-t border-gray-100">
              <p>Created: {formatDate(issue.createdAt)} at {formatTime(issue.createdAt)}</p>
              <p>Last Updated: {formatDate(issue.updatedAt)} at {formatTime(issue.updatedAt)}</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportedIssueDetailPage;
"use client";

import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Search, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getShipmentIssues, deleteIssue } from '../../../components/lib/apiClient';
import { toast } from 'react-toastify';

const IssuesPage = () => {
    const router = useRouter();

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPage: 0
    });
    const [deletingId, setDeletingId] = useState(null);


    // Mock shipment ID - in real app, this would come from route params or selected shipment
    const shipmentId = "69a749d79e1d313ca0719f26";

    // Fetch issues
    const fetchIssues = async (page = 1, search = '') => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔍 Fetching issues for shipment:', shipmentId);

            const response = await getShipmentIssues(shipmentId, page, 10, search);

            console.log('📦 Issues response:', response);

            if (response.success) {
                setIssues(response.data || []);
                setPagination(response.data.pagination || {
                    page: page,
                    limit: 10,
                    total: response.data?.length || 0,
                    totalPage: Math.ceil((response.data?.length || 0) / 10)
                });
            } else {
                throw new Error(response.message || 'Failed to fetch issues');
            }
        } catch (err) {
            console.error('Error fetching issues:', err);
            setError(err.message);

            // If unauthorized, redirect to login
            if (err.message.includes('Session expired') || err.message.includes('401')) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    console.log("issues", issues)

    // Handle delete issue
    const handleDeleteIssue = async (issueId) => {
        if (!window.confirm('Are you sure you want to delete this issue?')) {
            return;
        }

        try {
            setDeletingId(issueId);

            console.log('🗑️ Deleting issue:', issueId);

            const response = await deleteIssue(issueId);

            console.log('✅ Delete response:', response);

            if (response.success) {
                // Refresh the issues list
                fetchIssues(currentPage, searchTerm);
            } else {
                throw new Error(response.message || 'Failed to delete issue');
            }
        } catch (err) {
            console.error('Error deleting issue:', err);
            toast.error(err.message || 'Failed to delete issue. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    // Handle view issue details
    const handleViewIssue = (issueId) => {
        router.push(`/dashboard/Shipper/issues/${issueId}`);
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (shipmentId) {
                fetchIssues(1, searchTerm);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.totalPage) {
            setCurrentPage(page);
            fetchIssues(page, searchTerm);
        }
    };

    // Load issues on mount
    useEffect(() => {
        if (shipmentId) {
            fetchIssues(currentPage, searchTerm);
        }
    }, []);

    // Get status color
    const getStatusColor = (status) => {
        console.log("status", status)
        const statusLower = (status || '');
        if (statusLower?.includes('pending') || statusLower.includes('open')) {
            return 'bg-[#FF5C00]'; // Orange
        } else if (statusLower?.includes('resolved') || statusLower.includes('closed')) {
            return 'bg-green-600';
        } else if (statusLower?.includes('in progress')) {
            return 'bg-blue-600';
        }
        return 'bg-gray-600';
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        const total = pagination.totalPage || 1;

        if (total <= maxVisible) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(total);
            } else if (currentPage >= total - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = total - 3; i <= total; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(total);
            }
        }
        return pages;
    };

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

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
                {/* Header and Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-xl font-bold text-gray-800">Issue reported</h1>
                    <div className="flex items-center gap-0 border border-gray-200 rounded-lg overflow-hidden w-full md:w-80">
                        <div className="pl-3 py-2 bg-white">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search issues..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="px-2 py-2 text-sm w-full focus:outline-none text-gray-700"
                        />
                        {loading && (
                            <div className="pr-3">
                                <Loader className="w-4 h-4 animate-spin text-[#036BB4]" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#036BB4] text-white">
                                <th className="py-4 px-4 font-semibold text-sm">Issue ID</th>
                                <th className="py-4 px-4 font-semibold text-sm">Issue Title</th>
                                <th className="py-4 px-4 font-semibold text-sm">Shipment Id</th>
                                <th className="py-4 px-4 font-semibold text-sm">Transporter</th>
                                <th className="py-4 px-4 font-semibold text-sm">Reported On</th>
                                <th className="py-4 px-4 font-semibold text-sm">Status</th>
                                <th className="py-4 px-4 font-semibold text-sm text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && issues.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-gray-500">
                                        <Loader className="w-6 h-6 animate-spin text-[#036BB4] mx-auto mb-2" />
                                        <p>Loading issues...</p>
                                    </td>
                                </tr>
                            ) : issues.length > 0 ? (
                                issues.map((issue, idx) => (
                                    <tr key={issue._id || idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-4 text-sm text-gray-500 font-medium">#{issue._id?.slice(-6) || issue.id}...</td>
                                        <td className="py-4 px-4 text-sm text-gray-500">{issue.title || issue.issue_title || 'N/A'}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500">
                                            #{issue.shipment_id?.slice(0, 6) || 'N/A'}...
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                {/* <div className="w-5 h-5 rounded-full bg-blue-100 overflow-hidden border border-gray-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                                    {issue.transporter_id?.slice(0, 6) || 'N/A'}...
                                                </div> */}
                                                #{issue.transporter_id?.slice(0, 6) || 'N/A'}...
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-500">
                                            {/* {formatDate(issue.reported_on)} */}
                                            {issue?.reported_on}
                                        </td>
                                        <td className="py-4 px-4 text-gray-500">
                                            {/* <span className={`text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit`}>
                                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                            </span> */}
                                            {issue.status ? "Pending" : "Deliverd"}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewIssue(issue._id || issue.id)}
                                                    className="p-2 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
                                                    disabled={deletingId === (issue._id || issue.id)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteIssue(issue._id || issue.id)}
                                                    disabled={deletingId === (issue._id || issue.id)}
                                                    className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {deletingId === (issue._id || issue.id) ? (
                                                        <Loader className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-gray-500">
                                        {searchTerm ? 'No issues found matching your search.' : 'No issues found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPage > 0 && (
                    <>
                        <div className="flex items-center justify-end gap-2 mt-8">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`w-10 h-10 border border-[#036BB4] rounded-full flex items-center justify-center text-[#036BB4] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
                                    }`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {getPageNumbers().map((page, i) => (
                                <button
                                    key={i}
                                    onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                                    className={`w-10 h-10 rounded text-sm font-medium transition-colors ${page === currentPage
                                        ? 'bg-[#036BB4] text-white shadow-md'
                                        : page === '...'
                                            ? 'text-gray-500 cursor-default'
                                            : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === pagination.totalPage}
                                className={`w-10 h-10 border border-[#036BB4] rounded-full flex items-center justify-center text-[#036BB4] ${currentPage === pagination.totalPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
                                    }`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Summary */}
                        <div className="text-right mt-4 text-sm text-gray-500">
                            Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} issues
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default IssuesPage;
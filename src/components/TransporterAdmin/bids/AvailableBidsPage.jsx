"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

// Mock data for available bids
const mockAvailableBids = [
  { id: 1, title: "Ship 12 Pallets of Rice", from: "Abidjan", to: "Ouagadougou", minPrice: 1200, maxPrice: 1300, image: "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg" },
  { id: 2, title: "Ship 12 Pallets of Rice", from: "Abidjan", to: "Ouagadougou", minPrice: 1200, maxPrice: 1300, image: "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg" },
  { id: 3, title: "Ship 12 Pallets of Rice", from: "Abidjan", to: "Ouagadougou", minPrice: 1200, maxPrice: 1300, image: "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg" },
  { id: 4, title: "Ship 12 Pallets of Rice", from: "Abidjan", to: "Ouagadougou", minPrice: 1200, maxPrice: 1300, image: "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg" },
  { id: 5, title: "Ship 12 Pallets of Rice", from: "Abidjan", to: "Ouagadougou", minPrice: 1200, maxPrice: 1300, image: "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg" },
  { id: 6, title: "Ship 12 Pallets of Rice", from: "Abidjan", to: "Ouagadougou", minPrice: 1200, maxPrice: 1300, image: "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg" },
  { id: 7, title: "Ship 12 Pallets of Rice", from: "Abidjan", to: "Ouagadougou", minPrice: 1200, maxPrice: 1300, image: "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg" },
  { id: 8, title: "Ship 12 Pallets of Rice", from: "Abidjan", to: "Ouagadougou", minPrice: 1200, maxPrice: 1300, image: "https://static-01.daraz.com.bd/p/feafd4647394b1ac024ee541c7103434.jpg" },
];

const AvailableBidsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;


  const filteredBids = mockAvailableBids.filter(bid =>
    bid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bid.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bid.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBids.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBids = filteredBids.slice(startIndex, startIndex + itemsPerPage);

  const handleBidClick = (bidId) => {
    router.push(`/dashboard/Transporter/bids/${bidId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Available Bids</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Bids Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {currentBids.map((bid) => (
            <div
              key={bid.id}
              onClick={() => handleBidClick(bid.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-40">
                <Image
                  src={bid.image}
                  alt={bid.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                  {bid.title}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                  <MapPin className="w-3 h-3" />
                  <span>{bid.from} → {bid.to}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  ${bid.minPrice.toLocaleString()} - ${bid.maxPrice.toLocaleString()}
                </p>
              </div>  
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && (
              <>
                <span className="text-gray-400">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentPage === totalPages
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableBidsPage;
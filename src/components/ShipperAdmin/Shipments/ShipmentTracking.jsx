// "use client";

// import React, { useState } from 'react';
// import { ArrowLeft, MapPin, AlertTriangle } from 'lucide-react';
// import { useRouter } from 'next/router';

// const ShipmentTracking = () => {
//   const router = useRouter();
//   const { id } = router.query;

//   // This would typically come from an API call using the id
//   const [tracking] = useState({
//     id: id || '#####',
//     title: 'Ship 12 Pallets of Rice',
//     status: 'In progress',
//     estimatedDelivery: '14 Feb, 3:45 PM',
//     vehicleType: '401 Semi-Trailer',
//     capacity: '40 Tons',
//     plateNumber: 'AB-5432-C1',
//     driverName: 'Susan Rahman',
//     driverPhone: '0797111139',
//     proofOfDelivery: false,
//     vehicleImages: [
//       'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop',
//       'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
//       'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400&h=300&fit=crop',
//     ],
//   });

//   const handleBack = () => {
//     router.push('/dashboard/Shipper/shipments');
//   };

//   const handleReportIssue = () => {
//     const issue = prompt('Please describe the issue:');
//     if (issue) {
//       alert(`Issue reported: ${issue}\nOur support team will contact you shortly.`);
//     }
//   };

//   const handleConfirmDelivery = () => {
//     if (window.confirm('Are you sure you want to confirm delivery?')) {
//       alert('Delivery confirmed successfully!');
//       // Here you would typically make an API call to update the status
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen p-6">
//       {/* Header */}
//       <div className="flex items-center gap-4 mb-6">
//         <button
//           onClick={handleBack}
//           className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
//         >
//           <ArrowLeft className="w-5 h-5 text-black" />
//         </button>
//         <h1 className="text-xl font-semibold text-black">Shipment Tracking</h1>
//       </div>

//       <div className="flex items-center mb-6">
//         <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
//           {tracking.status}
//         </span>
//       </div>

//       {/* Map Placeholder */}
//       <div className="bg-white rounded-lg p-6 mb-6 h-64 relative overflow-hidden">
//         <img
//           src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=400&fit=crop"
//           alt="Map"
//           className="w-full h-full object-cover rounded"
//         />
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="bg-white bg-opacity-90 rounded-lg p-4 shadow-lg">
//             <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
//             <p className="text-black font-medium">Route Map View</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-6">
//         {/* Left Column */}
//         <div className="space-y-6">
//           {/* Basic Information */}
//           <div className="bg-white rounded-lg p-6">
//             <h2 className="text-lg font-semibold text-black mb-4">Basic Information</h2>
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Shipment Id</p>
//                 <p className="text-black font-bold text-xl">{tracking.id}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
//                 <p className="text-black font-medium">{tracking.estimatedDelivery}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Shipment title</p>
//                 <p className="text-black font-medium">{tracking.title}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Proof of delivery</p>
//                 <div className="flex items-center gap-2">
//                   <div className={`w-5 h-5 border-2 rounded ${
//                     tracking.proofOfDelivery 
//                       ? 'border-green-500 bg-green-500' 
//                       : 'border-blue-500'
//                   }`}>
//                     {tracking.proofOfDelivery && (
//                       <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                       </svg>
//                     )}
//                   </div>
//                   <span className="text-sm text-black">
//                     {tracking.proofOfDelivery ? 'Confirmed' : 'Pending'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Vehicle Details */}
//           <div className="bg-white rounded-lg p-6">
//             <h2 className="text-lg font-semibold text-black mb-4">Vehicle Details</h2>
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Vehicle Type</p>
//                 <p className="text-black font-medium">{tracking.vehicleType}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Plate Number</p>
//                 <p className="text-black font-medium">{tracking.plateNumber}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Capacity</p>
//                 <p className="text-black font-medium">{tracking.capacity}</p>
//               </div>
//             </div>

//             {/* Vehicle Images */}
//             <div className="mt-6">
//               <p className="text-sm text-gray-500 mb-3">Vehicle Images</p>
//               <div className="grid grid-cols-3 gap-3">
//                 {tracking.vehicleImages.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={img}
//                     alt={`Vehicle ${idx + 1}`}
//                     className="w-full h-24 object-cover rounded-lg"
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Column */}
//         <div className="space-y-6">
//           {/* Driver Details */}
//           <div className="bg-white rounded-lg p-6">
//             <h2 className="text-lg font-semibold text-black mb-4">Driver Details</h2>
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Name</p>
//                 <p className="text-black font-medium">{tracking.driverName}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Phone</p>
//                 <p className="text-black font-medium">{tracking.driverPhone}</p>
//               </div>
//             </div>

//             <div className="mt-6 space-y-3">
//               <button 
//                 onClick={handleReportIssue}
//                 className="w-full py-3 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
//               >
//                 <AlertTriangle className="w-4 h-4" />
//                 Report an Issue
//               </button>
//               <button 
//                 onClick={handleConfirmDelivery}
//                 className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
//               >
//                 Confirm Delivery
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShipmentTracking;
"use client";

import React, { useState } from 'react';
import { ChevronDown, Plus, Upload, ArrowRight, ArrowLeft } from 'lucide-react';

const MonthDropdown = ({ month, setMonth, show, setShow, months }) => (
  <div className="relative">
    <button
      onClick={() => setShow(!show)}
      className="flex items-center gap-2 px-4 py-1.5 text-white rounded-full text-sm font-medium transition-colors"
      style={{backgroundColor: '#036BB4'}}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#025191'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#036BB4'}
    >
      {month}
      <ChevronDown className={`w-4 h-4 transition-transform ${show ? 'rotate-180' : ''}`} />
    </button>
    {show && (
      <>
        <div className="fixed inset-0 z-10" onClick={() => setShow(false)} />
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px] max-h-[300px] overflow-y-auto">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => {setMonth(m); setShow(false);}}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${m === month ? 'font-medium' : 'text-gray-700'}`}
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

const ShipmentStats = () => {
  const [progressMonth, setProgressMonth] = useState('January');
  const [completedMonth, setCompletedMonth] = useState('January');
  const [spentMonth, setSpentMonth] = useState('January');
  const [showProgressDropdown, setShowProgressDropdown] = useState(false);
  const [showCompletedDropdown, setShowCompletedDropdown] = useState(false);
  const [showSpentDropdown, setShowSpentDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [shipmentData, setShipmentData] = useState({
    title: '', category: 'Furniture', description: '', weight: '', packagingType: 'Wooden Crates',
    length: '', width: '', height: '', images: [],
    pickupAddress: '', timeWindow: '', deliveryAddress: '', contactPerson: '',
    contactNumber: '', datePreference: '', insurance: false, forwarding: false,
  });

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const statsData = {
    January: { progress: 4, completed: 20, spent: 200 }, February: { progress: 6, completed: 18, spent: 250 },
    March: { progress: 3, completed: 22, spent: 280 }, April: { progress: 5, completed: 19, spent: 220 },
    May: { progress: 7, completed: 25, spent: 300 }, June: { progress: 4, completed: 21, spent: 240 },
    July: { progress: 8, completed: 23, spent: 290 }, August: { progress: 5, completed: 20, spent: 260 },
    September: { progress: 6, completed: 24, spent: 270 }, October: { progress: 4, completed: 22, spent: 230 },
    November: { progress: 7, completed: 26, spent: 310 }, December: { progress: 5, completed: 21, spent: 250 },
  };
  const categories = ['Furniture', 'Electronics', 'Food & Beverages', 'Clothing', 'Machinery', 'Chemicals', 'Construction Materials', 'Agricultural Products'];
  const packagingTypes = ['Wooden Crates', 'Cardboard Boxes', 'Plastic Containers', 'Pallets', 'Bulk', 'Bags', 'Barrels', 'Rolls'];

  const handleCreateShipment = () => {
    setShowCreateModal(true);
    setCurrentStep(1);
    setShipmentData({
      title: '', category: 'Furniture', description: '', weight: '', packagingType: 'Wooden Crates',
      length: '', width: '', height: '', images: [], pickupAddress: '', timeWindow: '',
      deliveryAddress: '', contactPerson: '', contactNumber: '', datePreference: '',
      insurance: false, forwarding: false,
    });
  };

  const handleCloseModal = () => {setShowCreateModal(false); setCurrentStep(1);};
  const handleInputChange = (e) => {const { name, value } = e.target; setShipmentData((prev) => ({...prev, [name]: value}));};
  const handleCheckboxChange = (e) => {const { name, checked } = e.target; setShipmentData((prev) => ({...prev, [name]: checked}));};
  const handleFileUpload = (e) => {const files = Array.from(e.target.files); setShipmentData((prev) => ({...prev, images: [...prev.images, ...files.slice(0, 5 - prev.images.length)]}));};
  const removeImage = (index) => {setShipmentData((prev) => ({...prev, images: prev.images.filter((_, i) => i !== index)}));};

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!shipmentData.title || !shipmentData.weight) {
        alert('Please fill in all required fields in Basic Information');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {setCurrentStep(currentStep - 1);};

  const handleSubmitShipment = () => {
    if (!shipmentData.pickupAddress || !shipmentData.deliveryAddress || !shipmentData.contactPerson) {
      alert('Please fill in all required fields in Pickup & Delivery Details');
      return;
    }
    console.log('Creating shipment:', shipmentData);
    alert(`Shipment "${shipmentData.title}" created successfully!`);
    const updatedProgress = statsData[progressMonth].progress + 1;
    console.log(`Updated progress for ${progressMonth}: ${updatedProgress} shipments`);
    handleCloseModal();
    alert(`Shipment published! You'll receive bids from transporters soon.\nProgress for ${progressMonth} updated to ${updatedProgress} shipments.`);
  };

  return (
    <>
      <div className="flex gap-4 p-6 bg-gray-50">
        <div 
          className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 flex items-center justify-center transition-all cursor-pointer min-w-[200px]"
          onMouseEnter={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.backgroundColor = '#f0f7ff';}}
          onMouseLeave={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = 'white';}}
          onClick={handleCreateShipment}
        >
          <div className="flex items-center gap-3 text-gray-500"><Plus className="w-6 h-6" /><span className="text-lg font-medium">Create Shipment</span></div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Shipments in progress</h3>
            <MonthDropdown month={progressMonth} setMonth={setProgressMonth} show={showProgressDropdown} setShow={setShowProgressDropdown} months={months} />
          </div>
          <p className="text-5xl font-bold text-gray-900">{statsData[progressMonth].progress}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Completed shipments</h3>
            <MonthDropdown month={completedMonth} setMonth={setCompletedMonth} show={showCompletedDropdown} setShow={setShowCompletedDropdown} months={months} />
          </div>
          <p className="text-5xl font-bold text-gray-900">{statsData[completedMonth].completed}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Total Money spent</h3>
            <MonthDropdown month={spentMonth} setMonth={setSpentMonth} show={showSpentDropdown} setShow={setShowSpentDropdown} months={months} />
          </div>
          <p className="text-5xl font-bold text-gray-900">{statsData[spentMonth].spent}</p>
        </div>
      </div>

      {showCreateModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={handleCloseModal} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">CREATE SHIPMENT</h1>
                    <div className="flex items-center gap-4 mt-4">
                      <div className={`flex items-center gap-2 ${currentStep === 1 ? 'font-medium' : 'text-gray-400'}`} style={currentStep === 1 ? {color: '#036BB4'} : {}}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${currentStep === 1 ? '' : 'bg-gray-100 text-gray-400'}`} style={currentStep === 1 ? {backgroundColor: '#036BB4'} : {}}>1</div>
                        <span className="font-medium">Basic Information</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <div className={`flex items-center gap-2 ${currentStep === 2 ? 'font-medium' : 'text-gray-400'}`} style={currentStep === 2 ? {color: '#036BB4'} : {}}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${currentStep === 2 ? '' : 'bg-gray-100 text-gray-400'}`} style={currentStep === 2 ? {backgroundColor: '#036BB4'} : {}}>2</div>
                        <span className="font-medium">Pickup & Delivery</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleCloseModal} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"><span className="text-2xl text-gray-500">×</span></button>
                </div>
              </div>

              {currentStep === 1 && (
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Shipment title</label>
                      <input type="text" name="title" value={shipmentData.title} onChange={handleInputChange} placeholder="Ship 12 Pallets of Rice"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                        onFocus={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.boxShadow = '0 0 0 2px #f0f7ff';}}
                        onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select name="category" value={shipmentData.category} onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                          onFocus={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.boxShadow = '0 0 0 2px #f0f7ff';}}
                          onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}}>
                          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <input type="text" name="description" value={shipmentData.description} onChange={handleInputChange} placeholder="12 shrink-wrapped pallets, non-fragile"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                          onFocus={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.boxShadow = '0 0 0 2px #f0f7ff';}}
                          onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                        <input type="number" name="weight" value={shipmentData.weight} onChange={handleInputChange} placeholder="2,300"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                          onFocus={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.boxShadow = '0 0 0 2px #f0f7ff';}}
                          onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type of packaging</label>
                        <select name="packagingType" value={shipmentData.packagingType} onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                          onFocus={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.boxShadow = '0 0 0 2px #f0f7ff';}}
                          onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}}>
                          {packagingTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (L/W/H cm)</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="number" name="length" value={shipmentData.length} onChange={handleInputChange} placeholder="Length"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                          onFocus={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.boxShadow = '0 0 0 2px #f0f7ff';}}
                          onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}} />
                        <input type="number" name="width" value={shipmentData.width} onChange={handleInputChange} placeholder="Width"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                          onFocus={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.boxShadow = '0 0 0 2px #f0f7ff';}}
                          onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}} />
                        <input type="number" name="height" value={shipmentData.height} onChange={handleInputChange} placeholder="Height"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                          onFocus={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.boxShadow = '0 0 0 2px #f0f7ff';}}
                          onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload images</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#036BB4'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}>
                        <input type="file" id="image-upload" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-gray-600">Click to upload or drag and drop</span>
                          <span className="text-sm text-gray-500 mt-1">Max 5 images, 5MB each</span>
                        </label>
                      </div>
                      {shipmentData.images.length > 0 && (
                        <div className="mt-4"><div className="flex flex-wrap gap-2">
                          {shipmentData.images.map((img, idx) => (
                            <div key={idx} className="relative">
                              <div className="w-20 h-20 rounded border border-gray-200 overflow-hidden">
                                <img src={URL.createObjectURL(img)} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                              </div>
                              <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">×</button>
                            </div>
                          ))}
                        </div></div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                    <button type="button" onClick={handleNextStep}
                      className="px-6 py-3 text-white font-medium rounded-lg flex items-center gap-2"
                      style={{backgroundColor: '#036BB4'}}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#025191'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#036BB4'}>
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label>
                      <input type="text" name="pickupAddress" value={shipmentData.pickupAddress} onChange={handleInputChange} placeholder="Enter full pickup address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                        onFocus={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.boxShadow = '0 0 0 2px #f0f7ff';}}
                        onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Window</label>
                      <input type="time" name="timeWindow" value={shipmentData.timeWindow} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                        onFocus={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.boxShadow = '0 0 0 2px #f0f7ff';}}
                        onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                      <input type="text" name="deliveryAddress" value={shipmentData.deliveryAddress} onChange={handleInputChange} placeholder="Enter full delivery address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                        onFocus={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.boxShadow = '0 0 0 2px #f0f7ff';}}
                        onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                      <input type="text" name="contactPerson" value={shipmentData.contactPerson} onChange={handleInputChange} placeholder="Enter contact person name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                        onFocus={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.boxShadow = '0 0 0 2px #f0f7ff';}}
                        onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person Number</label>
                      <input type="tel" name="contactNumber" value={shipmentData.contactNumber} onChange={handleInputChange} placeholder="Enter contact number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                        onFocus={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.boxShadow = '0 0 0 2px #f0f7ff';}}
                        onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Preference</label>
                      <input type="text" name="datePreference" value={shipmentData.datePreference} onChange={handleInputChange} placeholder="e.g., Flexible within 2 days"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                        onFocus={(e) => {e.currentTarget.style.borderColor = '#036BB4'; e.currentTarget.style.boxShadow = '0 0 0 2px #f0f7ff';}}
                        onBlur={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none';}} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Additional services</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer transition-all hover:border-blue-400" onClick={() => setShipmentData(prev => ({...prev, insurance: !prev.insurance}))}>
                          <input type="checkbox" name="insurance" checked={shipmentData.insurance} onChange={handleCheckboxChange}
                            className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer" style={{accentColor: '#036BB4'}} />
                          <label className="text-sm font-medium text-gray-700 cursor-pointer">Insurance</label>
                        </div>
                        <div className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer transition-all hover:border-blue-400" onClick={() => setShipmentData(prev => ({...prev, forwarding: !prev.forwarding}))}>
                          <input type="checkbox" name="forwarding" checked={shipmentData.forwarding} onChange={handleCheckboxChange}
                            className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer" style={{accentColor: '#036BB4'}} />
                          <label className="text-sm font-medium text-gray-700 cursor-pointer">Forwarding</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <button type="button" onClick={handlePrevStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg flex items-center gap-2 transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button type="button" onClick={handleSubmitShipment}
                      className="px-6 py-3 text-white font-medium rounded-lg transition-colors"
                      style={{backgroundColor: '#036BB4'}}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#025191'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#036BB4'}>
                      Publish
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ShipmentStats;
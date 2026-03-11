"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  FileText,
  AlertCircle,
  Settings,
  ChevronUp,
  LogOut,
  User,
  Lock,
  Wallet,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard/Shipper", icon: LayoutDashboard },
  { name: "My Shipments", href: "/dashboard/Shipper/shipments", icon: Truck },
  { name: "Invoices", href: "/dashboard/Shipper/invoices", icon: FileText },
  { name: "Issue reported", href: "/dashboard/Shipper/issues", icon: AlertCircle },
];

const settingsDropdown = [
  { name: "Edit Profile", href: "/dashboard/Shipper/settings/profile", icon: User },
  // { name: "Change Password", href: "/dashboard/Shipper/settings/password", icon: Lock },
  { name: "Bank Details", href: "/dashboard/Shipper/settings/bank", icon: Wallet },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white text-black shadow-lg z-40 
      transition-all duration-300 ease-in-out border-r border-[#D6D6D6] overflow-x-hidden
      ${isOpen ? "w-64" : "w-20"}`}
    >
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        
        {/* Header Section */}
        <div className={`flex items-center h-16 border-b border-[#D6D6D6] flex-shrink-0 transition-all duration-300 ${isOpen ? "px-6 justify-between" : "justify-center"}`}>
          {isOpen && (
            <span className="font-bold text-lg whitespace-nowrap overflow-hidden" style={{color: '#036BB4'}}>
              LAWAPAN
            </span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 flex-grow px-3 space-y-2">
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center h-12 rounded-lg transition-all relative group ${
                  isActive
                    ? "shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                } ${!isOpen ? "justify-center" : "px-3"}`}
                style={isActive ? {backgroundColor: '#036BB4', color: '#ffffff'} : {}}
                onMouseEnter={(e) => !isActive && (e.currentTarget.style.color = '#036BB4')}
                onMouseLeave={(e) => !isActive && (e.currentTarget.style.color = '#4b5563')}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                
                <span
                  className={`ml-3 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                    isOpen ? "opacity-100 w-auto visible" : "opacity-0 w-0 invisible absolute"
                  }`}
                >
                  {name}
                </span>
                {!isOpen && (
                  <div className="absolute left-16 bg-gray-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
                    {name}
                  </div>
                )}
              </Link>
            );
          })}

          {/* Settings Section - Fixed Alignment */}
          <div className="pt-2">
            <button
              onClick={() => isOpen && setSettingsOpen(!settingsOpen)}
              className={`w-full flex items-center h-12 rounded-lg transition-all relative group text-gray-600 hover:bg-gray-50 ${!isOpen ? "justify-center" : "px-3"}`}
              style={settingsOpen && isOpen ? {backgroundColor: '#f0f7ff', color: '#036BB4'} : {}}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              
              <div className={`flex items-center justify-between flex-grow transition-all duration-300 ${
                isOpen ? "ml-3 opacity-100 visible" : "opacity-0 w-0 invisible absolute"
              }`}>
                <span className="font-medium text-sm whitespace-nowrap">Settings</span>
                <ChevronUp
                  className={`w-4 h-4 transition-transform duration-300 ${settingsOpen ? "rotate-0" : "rotate-180"}`}
                />
              </div>

               {!isOpen && (
                  <div className="absolute left-16 bg-gray-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
                    Settings
                  </div>
                )}
            </button>

            {/* Submenu Alignment */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              settingsOpen && isOpen ? "max-h-60 mt-2" : "max-h-0"
            }`}>
              <div className="bg-gray-50 rounded-lg p-1 space-y-1 mx-1 border border-gray-100">
                {settingsDropdown.map(({ name, href, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={name}
                      href={href}
                      className={`flex items-center px-3 py-2 rounded-md text-xs font-medium transition-all hover:bg-white ${
                        isActive
                          ? "shadow-md"
                          : "text-gray-500"
                      }`}
                      style={isActive ? {backgroundColor: '#036BB4', color: '#ffffff'} : {}}
                      onMouseEnter={(e) => !isActive && (e.currentTarget.style.color = '#036BB4')}
                      onMouseLeave={(e) => !isActive && (e.currentTarget.style.color = '#9ca3af')}
                    >
                      <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="whitespace-nowrap">{name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Logout Button Footer */}
        <div className="p-3 border-t border-[#D6D6D6] mt-auto">
          <button className={`flex items-center h-12 w-full text-red-500 hover:bg-red-50 rounded-lg transition-all group relative ${
            !isOpen ? "justify-center" : "px-3"
          }`}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`ml-3 text-sm font-semibold transition-all duration-300 ${
              isOpen ? "opacity-100 visible" : "opacity-0 w-0 invisible absolute"
            }`}>
              Logout
            </span>
            
            {!isOpen && (
              <div className="absolute left-16 bg-red-600 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-lg">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
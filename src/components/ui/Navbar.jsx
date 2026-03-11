"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "../lib/apiClient";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuthStatus = () => {
      const storedToken = localStorage.getItem("auth_token");
      const storedRole = localStorage.getItem("user_role");
      const storedEmail = localStorage.getItem("rememberEmail");

      if (storedToken) {
        setToken(storedToken);
        setRole(storedRole || "");
        setUserEmail(storedEmail || "User");
        console.log("✅ User authenticated");
        console.log("Token:", storedToken.substring(0, 20) + "...");
        console.log("Role:", storedRole);
      } else {
        setToken("");
        setRole("");
        setUserEmail("");
        console.log("❌ User not authenticated");
      }
    };

    checkAuthStatus();

    // Check auth status on storage change (for multi-tab support)
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  const handleLogout = () => {
    console.log("🚪 Logging out...");
    
    // Clear all auth data
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("shipper_id");
    localStorage.removeItem("transporter_id");
    localStorage.removeItem("rememberEmail");
    
    // Clear cookies
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    
    // Update state
    setToken("");
    setRole("");
    setUserEmail("");
    setIsDropdownOpen(false);
    
    console.log("✅ Logout successful");
    
    // Redirect to login
    router.push("/login");
  };

  const isActive = (path) => pathname === path;

  // Get dashboard link based on role
  const getDashboardLink = () => {
    if (role === "SHIPPER") return "/dashboard/Shipper";
    if (role === "TRANSPORTER") return "/dashboard/Transporter";
    return "/";
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userEmail) {
      return userEmail.charAt(0).toUpperCase();
    }
    if (role) {
      return role.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
          isScrolled ? "shadow-lg backdrop-blur-md bg-white/80" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="">
              <div className="relative w-[67px] h-[67px]">
                <Image
                  src="/main-logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: "Home", path: "/" },
                { name: "Shipper", path: "/shipper" },
                { name: "Transporter", path: "/transporter" },
                { name: "FAQ", path: "/faq" },
                ...(token ? [{ name: "Dashboard", path: getDashboardLink() }] : []),
              ].map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="relative group py-2"
                >
                  <span
                    className={`font-medium transition-colors duration-300 ${
                      isActive(link.path)
                        ? "text-[#036BB4]"
                        : "text-gray-700 group-hover:text-[#036BB4]"
                    }`}
                  >
                    {link.name}
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#036BB4] transform origin-left transition-transform duration-300 ${
                      isActive(link.path)
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </Link>
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {token ? (
                // Logged in - Show Avatar and Dropdown
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#036BB4] to-[#025a99] flex items-center justify-center text-white font-bold shadow-md">
                      {getUserInitials()}
                    </div>
                    
                    {/* Role Badge */}
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-700">
                        {role || "User"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {userEmail.split('@')[0] || "Account"}
                      </span>
                    </div>
                    
                    {/* Dropdown Arrow */}
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {userEmail || "User Account"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {role} Account
                        </p>
                      </div>

                      {/* Dashboard Link */}
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>

                      {/* Settings Link (Optional) */}
                      {/* <Link
                        href="/settings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link> */}

                      {/* Divider */}
                      <div className="border-t border-gray-100 my-2"></div>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Not logged in - Show Login/Signup buttons
                <>
                  <Link href="/signup">
                    <button className="px-6 py-2 text-[#036BB4] font-medium border border-[#036BB4] rounded-full hover:bg-blue-50 transform hover:scale-105 transition-all duration-300">
                      Sign Up
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="px-6 py-2 bg-[#036BB4] text-white font-medium rounded-full hover:bg-[#025a99] transform hover:scale-105 hover:shadow-lg transition-all duration-300">
                      Login
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#036BB4] hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden border-t border-gray-200 overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            {/* Mobile User Info (if logged in) */}
            {token && (
              <div className="px-3 py-3 mb-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#036BB4] to-[#025a99] flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {getUserInitials()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {userEmail.split('@')[0] || "User"}
                    </p>
                    <p className="text-xs text-gray-600">{role} Account</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Navigation Links */}
            {[
              { name: "Home", path: "/" },
              { name: "Shipper", path: "/shipper" },
              { name: "Transporter", path: "/transporter" },
              { name: "FAQ", path: "/faq" },
              ...(token ? [{ name: "Dashboard", path: getDashboardLink() }] : []),
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md font-medium transition-all duration-300 transform ${
                  isActive(link.path)
                    ? "text-[#036BB4] bg-blue-50 border-l-4 border-[#036BB4]"
                    : "text-gray-700 hover:text-[#036BB4] hover:bg-gray-50 hover:translate-x-1"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            {token ? (
              // Logged in - Show Logout
              <div className="pt-4 space-y-2">
                <Link href="/settings">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-2 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition-all duration-300 flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              // Not logged in - Show Login/Signup
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Link href="/signup">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full px-4 py-2 text-[#036BB4] font-medium border border-[#036BB4] rounded-full hover:bg-blue-50 transition-all duration-300"
                  >
                    Sign Up
                  </button>
                </Link>
                <Link href="/login">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full px-4 py-2 bg-[#036BB4] text-white font-medium rounded-full hover:bg-[#025a99] transition-all duration-300"
                  >
                    Login
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16"></div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
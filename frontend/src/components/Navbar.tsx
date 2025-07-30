import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Leaf, LogOut, User, Home, Calendar, ChevronLeft } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsSidebarOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/my-sessions', label: 'My Sessions', icon: Calendar },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-100 z-40">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Leaf className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">
              Arvyax Wellness
            </span>
            <span className="text-lg font-bold text-gray-900 sm:hidden">
              Arvyax
            </span>
          </Link>

          {/* User Info & Menu Button */}
          <div className="flex items-center space-x-3">
            {/* User Info (Desktop only) */}
            <div className="hidden md:flex items-center space-x-2 text-gray-700">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            
            {/* Menu Button - Different icons for desktop vs mobile */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-200"
            >
              {/* Desktop: Show ChevronLeft, Mobile: Show hamburger Menu */}
              <ChevronLeft className="hidden md:block h-6 w-6" />
              <Menu className="md:hidden h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Right Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Arvyax Wellness
            </span>
          </div>
          
          <button
            onClick={closeSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-100 bg-emerald-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600">Welcome back!</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={closeSidebar}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-emerald-100 text-emerald-700 border-l-4 border-emerald-600'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Spacer */}
      <div className="pt-16">
        {/* Your main content will go here */}
      </div>
    </>
  );
};

export default Navbar;
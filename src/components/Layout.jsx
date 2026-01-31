import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Trophy, LogOut, Layers, Menu, X, User, Settings, Mail, ChevronDown, CheckSquare, Building2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const Layout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const { systemSettings } = useData();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Employees', path: '/employees' },
        { icon: Layers, label: 'Teams', path: '/teams' },
        { icon: Trophy, label: 'Games', path: '/games' },
        { icon: CheckSquare, label: 'Daily Task', path: '/daily-task' },
        { icon: Building2, label: 'Workforce', path: '/company-workforce' },
        { icon: ShieldCheck, label: 'Admin', path: '/admin' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">
            {/* Top Navigation Bar - Full Width */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm transition-all duration-300">
                <div className="w-full px-4 md:px-8">
                    <div className="flex justify-between h-20 items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2.5">
                            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                                <Users size={24} strokeWidth={2.5} />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">
                                {systemSettings?.appName || 'TeamHub'}
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-slate-900 text-white shadow-md transform scale-105'
                                            : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                                        }`
                                    }
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </NavLink>
                            ))}

                            <div className="h-6 w-px bg-slate-200 mx-4"></div>

                            {/* User Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                                >
                                    <User size={16} className="text-indigo-600" />
                                    <span className="text-sm font-medium text-slate-700 hidden lg:inline">{currentUser?.name}</span>
                                    <ChevronDown size={16} className={`text-indigo-600 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in">
                                        {/* User Info Section */}
                                        <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 border-b border-indigo-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {currentUser?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-slate-800 truncate">{currentUser?.name}</p>
                                                    <p className="text-sm text-slate-500 truncate flex items-center gap-1">
                                                        <Mail size={12} />
                                                        {currentUser?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Options */}
                                        <div className="p-2">
                                            <button
                                                onClick={() => {
                                                    setIsProfileDropdownOpen(false);
                                                    navigate('/profile');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-indigo-50 rounded-xl transition-colors"
                                            >
                                                <User size={18} className="text-indigo-600" />
                                                My Profile
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsProfileDropdownOpen(false);
                                                    navigate('/settings');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-indigo-50 rounded-xl transition-colors"
                                            >
                                                <Settings size={18} className="text-indigo-600" />
                                                Settings
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsProfileDropdownOpen(false);
                                                    navigate('/admin');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-amber-50 rounded-xl transition-colors"
                                            >
                                                <ShieldCheck size={18} className="text-amber-600" />
                                                Admin Panel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsProfileDropdownOpen(false);
                                                    handleLogout();
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <LogOut size={18} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </nav>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl animate-fade-in absolute w-full shadow-xl">
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium transition-all ${isActive
                                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`
                                    }
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </NavLink>
                            ))}

                            {/* Mobile User Info */}
                            <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-xl mt-2 border border-indigo-100">
                                <User size={20} className="text-indigo-600" />
                                <span className="text-sm font-medium text-slate-700">{currentUser?.name}</span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 mt-2 transition-colors"
                            >
                                <LogOut size={20} />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content - Full Width */}
            <main className="flex-1 w-full px-4 md:px-8 py-8 animate-fade-in">
                {children}
            </main>
        </div>
    );
};

export default Layout;

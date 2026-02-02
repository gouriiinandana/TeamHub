import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, CheckCircle, Shield, Users, Star, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { currentUser, updateUserProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        age: currentUser?.age || '',
        location: currentUser?.location || ''
    });

    const { teams, employees } = useData();
    const myEmployeeRecord = employees.find(emp => emp.email === currentUser?.email);
    const myTeam = myEmployeeRecord?.teamId ? teams.find(t => t.id === myEmployeeRecord.teamId) : null;

    const rankedTeams = [...teams].sort((a, b) => (b.points || 0) - (a.points || 0));
    const myTeamRank = myTeam ? rankedTeams.findIndex(t => t.id === myTeam.id) + 1 : null;

    const handleSave = () => {
        updateUserProfile({
            name: formData.name,
            phone: formData.phone,
            age: formData.age,
            location: formData.location
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            phone: currentUser?.phone || '',
            age: currentUser?.age || '',
            location: currentUser?.location || ''
        });
        setIsEditing(false);
    };

    const handleVerifyEmail = () => {
        // Simulate email verification
        updateUserProfile({ emailVerified: true });
        alert('Email verification sent! Check your inbox.');
    };

    const handleVerifyPhone = () => {
        // Simulate phone verification
        updateUserProfile({ phoneVerified: true });
        alert('Phone verification code sent via SMS!');
    };

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-indigo-100">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
                        My Profile
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm md:text-base">Manage your personal information and settings</p>
                </div>

                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        <Edit3 size={20} /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={handleCancel}
                            className="flex-1 md:flex-none px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <X size={20} /> Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 md:flex-none bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-green-500/30 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={20} /> Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Avatar and Quick Info */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                        <div className="flex flex-col items-center">
                            {/* Avatar */}
                            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-5xl shadow-lg mb-4">
                                {currentUser?.name?.charAt(0).toUpperCase()}
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 text-center">{currentUser?.name}</h2>
                            <p className="text-slate-500 text-sm mt-1">{currentUser?.email}</p>

                            <div className="w-full mt-6 pt-6 border-t border-slate-100">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Email Status</span>
                                        {currentUser?.emailVerified ? (
                                            <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                                                <CheckCircle size={16} /> Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-amber-600 text-sm font-semibold">
                                                <Shield size={16} /> Unverified
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Phone Status</span>
                                        {currentUser?.phoneVerified ? (
                                            <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                                                <CheckCircle size={16} /> Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-amber-600 text-sm font-semibold">
                                                <Shield size={16} /> Unverified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Assignment Info */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mt-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Users size={20} className="text-indigo-600" /> Official Assignment
                        </h3>

                        {myTeam ? (
                            <div className="space-y-6">
                                <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">
                                            {myTeam.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 truncate">{myTeam.name}</h4>
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Rank #{myTeamRank}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                            <Trophy size={14} className="text-amber-500" /> {myTeam.points || 0} Team Pts
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                            <Star size={14} className="text-pink-500" /> {myEmployeeRecord?.points || 0} Your Pts
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to="/my-team"
                                    className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                                >
                                    View Team Dashboard <ArrowRight size={16} />
                                </Link>
                            </div>
                        ) : (
                            <div className="p-6 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                                <p className="text-sm text-slate-400">No team assigned yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Profile Fields */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Personal Information</h3>

                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="text-sm font-semibold text-slate-600 ml-1 mb-2 block flex items-center gap-2">
                                    <User size={16} className="text-indigo-600" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-600"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm font-semibold text-slate-600 ml-1 mb-2 block flex items-center gap-2">
                                    <Mail size={16} className="text-indigo-600" />
                                    Email Address
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 cursor-not-allowed"
                                    />
                                    {!currentUser?.emailVerified && (
                                        <button
                                            onClick={handleVerifyEmail}
                                            className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl font-semibold hover:bg-green-100 transition-colors whitespace-nowrap"
                                        >
                                            Verify
                                        </button>
                                    )}
                                    {currentUser?.emailVerified && (
                                        <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl font-semibold flex items-center gap-2">
                                            <CheckCircle size={18} /> Verified
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 mt-1 ml-1">Email cannot be changed</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="text-sm font-semibold text-slate-600 ml-1 mb-2 block flex items-center gap-2">
                                    <Phone size={16} className="text-indigo-600" />
                                    Phone Number
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="+1 (555) 123-4567"
                                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-600"
                                    />
                                    {formData.phone && !currentUser?.phoneVerified && !isEditing && (
                                        <button
                                            onClick={handleVerifyPhone}
                                            className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl font-semibold hover:bg-green-100 transition-colors whitespace-nowrap"
                                        >
                                            Verify
                                        </button>
                                    )}
                                    {currentUser?.phoneVerified && (
                                        <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl font-semibold flex items-center gap-2">
                                            <CheckCircle size={18} /> Verified
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Age */}
                            <div>
                                <label className="text-sm font-semibold text-slate-600 ml-1 mb-2 block flex items-center gap-2">
                                    <Calendar size={16} className="text-indigo-600" />
                                    Age
                                </label>
                                <input
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="25"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-600"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="text-sm font-semibold text-slate-600 ml-1 mb-2 block flex items-center gap-2">
                                    <MapPin size={16} className="text-indigo-600" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="New York, USA"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

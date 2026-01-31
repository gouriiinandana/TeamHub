import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Lock } from 'lucide-react';

const Settings = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(true);

    const handleChangePassword = () => {
        alert('Change password functionality - would open a modal in production');
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Delete account functionality - would require confirmation in production');
        }
    };

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="pb-6 border-b border-slate-200">
                <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
                    Settings
                </h1>
                <p className="text-slate-500 mt-1 text-sm md:text-base">Manage your preferences and account settings</p>
            </div>

            {/* Settings Content */}
            <div className="space-y-6">
                {/* Notification Preferences */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Bell size={20} className="text-indigo-600" />
                        Notification Preferences
                    </h2>
                    <p className="text-sm text-slate-500 mb-6">
                        Receive alerts and updates about your account activity, job applications, and interviews.
                    </p>

                    <div className="space-y-4">
                        {/* Email Notifications */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-start gap-3">
                                <Mail size={20} className="text-indigo-600 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-slate-800">Email Notifications</h3>
                                    <p className="text-sm text-slate-500">
                                        Receive email alerts whenever your account is signed in from a new device or browser
                                    </p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={emailNotifications}
                                    onChange={(e) => setEmailNotifications(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        {/* SMS Notifications */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-start gap-3">
                                <MessageSquare size={20} className="text-indigo-600 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-slate-800">SMS Notifications</h3>
                                    <p className="text-sm text-slate-500">
                                        Receive SMS alerts for account activity and updates
                                    </p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={smsNotifications}
                                    onChange={(e) => setSmsNotifications(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Security & Privacy */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Lock size={20} className="text-indigo-600" />
                        Security & Privacy
                    </h2>

                    <div className="space-y-4">
                        {/* Password */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                                <h3 className="font-semibold text-slate-800">Password</h3>
                                <p className="text-sm text-slate-500">Change your account password</p>
                            </div>
                            <button
                                onClick={handleChangePassword}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                            >
                                Change password
                            </button>
                        </div>

                        {/* Delete Account */}
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                            <div>
                                <h3 className="font-semibold text-red-800">Close account</h3>
                                <p className="text-sm text-red-600">
                                    Permanently delete all the data associated with your account and the apps you use.{' '}
                                    <button onClick={handleDeleteAccount} className="underline font-semibold">
                                        Delete account
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

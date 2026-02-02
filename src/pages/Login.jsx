import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Users, KeyRound } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login, resetPassword } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!resetEmail) {
            setResetMessage('Please enter your email address');
            return;
        }

        try {
            await resetPassword(resetEmail);
            setResetMessage(`Password reset link has been sent to ${resetEmail}. Please check your inbox.`);

            // Auto-close modal after 5 seconds
            setTimeout(() => {
                setShowForgotPassword(false);
                setResetEmail('');
                setResetMessage('');
            }, 5000);
        } catch (err) {
            setResetMessage(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl mb-4 shadow-lg">
                        <Users className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 mb-2">
                        TeamHub
                    </h1>
                    <p className="text-slate-500">Welcome back! Please login to continue.</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Login</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-600 ml-1 mb-2 block">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600 ml-1 mb-2 block">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Logging in...' : (
                                <>
                                    <LogIn size={20} /> Login
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-500 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-xs mt-6">
                    © 2026 TeamHub. All rights reserved.
                </p>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <KeyRound size={20} className="text-indigo-600" />
                                Reset Password
                            </h3>
                            <button
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setResetEmail('');
                                    setResetMessage('');
                                }}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-slate-600 text-sm mb-4">
                            Enter your registered email address and we'll send you a link to reset your password.
                        </p>

                        {resetMessage && (
                            <div className={`mb-4 p-3 rounded-xl text-sm ${resetMessage.includes('sent')
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : 'bg-red-50 border border-red-200 text-red-600'
                                }`}>
                                {resetMessage}
                            </div>
                        )}

                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="you@company.com"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setResetEmail('');
                                        setResetMessage('');
                                    }}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                                >
                                    Send Reset Link
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;

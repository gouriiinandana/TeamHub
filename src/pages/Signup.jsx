import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, Users } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            await signup({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
                    <p className="text-slate-500">Join your team! Create your account.</p>
                </div>

                {/* Signup Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Create Account</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-600 ml-1 mb-2 block">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600 ml-1 mb-2 block">
                                Company Email
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
                                    placeholder="At least 6 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600 ml-1 mb-2 block">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    placeholder="Re-enter your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Creating Account...' : (
                                <>
                                    <UserPlus size={20} /> Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-500 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-xs mt-6">
                    © 2026 TeamHub. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Signup;

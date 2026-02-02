import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Crown, Activity, Users, Target, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const { teams, employees } = useData();
    const isAdmin = currentUser?.role === 'Admin';

    // Find if the logged-in user is in the employee list
    const myEmployeeRecord = useMemo(() => {
        return employees.find(emp => emp.email === currentUser?.email);
    }, [employees, currentUser]);

    // Find their team
    const myTeam = useMemo(() => {
        if (!myEmployeeRecord || !myEmployeeRecord.teamId) return null;
        return teams.find(t => t.id === myEmployeeRecord.teamId);
    }, [myEmployeeRecord, teams]);

    // Sort Teams for Leaderboard
    const rankedTeams = useMemo(() => {
        return [...teams].sort((a, b) => (b.points || 0) - (a.points || 0));
    }, [teams]);

    const myTeamRank = useMemo(() => {
        if (!myTeam) return null;
        return rankedTeams.findIndex(t => t.id === myTeam.id) + 1;
    }, [myTeam, rankedTeams]);

    // Sort Employees for Individual Leaderboard
    const rankedEmployees = useMemo(() => {
        return [...employees].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5);
    }, [employees]);

    // Calculate total stats
    const totalTeamPoints = useMemo(() => {
        return teams.reduce((sum, team) => sum + (team.points || 0), 0);
    }, [teams]);

    const totalEmployees = employees.length;

    // Calculate max points for percentage calculation
    const maxPoints = useMemo(() => {
        return Math.max(...teams.map(t => t.points || 0), 1);
    }, [teams]);

    // Color palette for progress bars
    const colors = [
        { from: 'from-purple-500', to: 'to-purple-600', bg: 'bg-purple-100' },
        { from: 'from-pink-500', to: 'to-pink-600', bg: 'bg-pink-100' },
        { from: 'from-cyan-500', to: 'to-cyan-600', bg: 'bg-cyan-100' },
        { from: 'from-blue-500', to: 'to-blue-600', bg: 'bg-blue-100' },
        { from: 'from-teal-500', to: 'to-teal-600', bg: 'bg-teal-100' },
        { from: 'from-emerald-500', to: 'to-emerald-600', bg: 'bg-emerald-100' },
        { from: 'from-amber-500', to: 'to-amber-600', bg: 'bg-amber-100' },
        { from: 'from-orange-500', to: 'to-orange-600', bg: 'bg-orange-100' },
    ];

    const Podium = ({ winners }) => {
        const [first, second, third] = winners;
        return (
            <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-12 min-h-[auto] md:h-80 mb-12 select-none pt-24 md:pt-0 w-full max-w-5xl mx-auto">

                {/* Second Place */}
                <div className="order-2 md:order-1 flex flex-col items-center w-full md:w-auto transform md:translate-y-4">
                    <div className="bg-white/80 backdrop-blur p-4 rounded-xl shadow-lg border border-white/50 mb-2 md:mb-4 text-center w-32 md:w-40 animate-float" style={{ animationDelay: '0.5s' }}>
                        <span className="font-bold text-slate-700 block truncate">{second?.name || 'N/A'}</span>
                        <span className="text-sm font-bold text-slate-400">{second?.points || 0} pts</span>
                    </div>
                    <div className="w-24 md:w-32 h-24 md:h-40 bg-gradient-to-t from-slate-300 to-slate-100 rounded-lg md:rounded-t-lg shadow-inner flex items-center md:items-end justify-center pb-0 md:pb-4 medal-shine border border-white/40 overflow-hidden relative">
                        <Medal size={36} className="text-slate-400 drop-shadow-md relative z-10 md:mb-2" />
                        <div className="absolute inset-0 bg-white/10 skew-y-12 md:translate-y-20"></div>
                    </div>
                    <div className="md:hidden mt-2 font-bold text-slate-400 text-lg">2nd</div>
                </div>

                {/* First Place */}
                <div className="order-1 md:order-2 flex flex-col items-center w-full md:w-auto md:-translate-y-4 mb-6 md:mb-0">
                    <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl shadow-yellow-500/20 border-2 border-yellow-100 mb-2 md:mb-4 text-center w-32 md:w-40 z-20 animate-float">
                        <span className="font-black text-slate-800 text-xl block truncate">{first?.name || 'N/A'}</span>
                        <span className="text-sm font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">{first?.points || 0} pts</span>
                    </div>
                    <div className="w-32 md:w-40 h-32 md:h-56 bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-2xl md:rounded-t-2xl shadow-2xl flex items-center md:items-end justify-center pb-0 md:pb-6 medal-shine relative z-10 border border-yellow-100 overflow-hidden">
                        <Trophy size={60} className="text-white drop-shadow-md relative z-10 md:mb-2" />
                        <div className="absolute inset-0 bg-white/20 skew-y-12 md:translate-y-20"></div>
                    </div>
                    <div className="md:hidden mt-2 font-black text-yellow-500 text-2xl">1st</div>
                </div>

                {/* Third Place */}
                <div className="order-3 flex flex-col items-center w-full md:w-auto transform md:translate-y-8">
                    <div className="bg-white/80 backdrop-blur p-4 rounded-xl shadow-lg border border-white/50 mb-2 md:mb-4 text-center w-32 md:w-40 animate-float" style={{ animationDelay: '1s' }}>
                        <span className="font-bold text-slate-700 block truncate">{third?.name || 'N/A'}</span>
                        <span className="text-sm font-bold text-slate-400">{third?.points || 0} pts</span>
                    </div>
                    <div className="w-24 md:w-32 h-24 md:h-32 bg-gradient-to-t from-orange-300 to-orange-100 rounded-lg md:rounded-t-lg shadow-inner flex items-center md:items-end justify-center pb-0 md:pb-4 medal-shine border border-white/40 overflow-hidden relative">
                        <Medal size={32} className="text-orange-600 drop-shadow-md relative z-10 md:mb-2" />
                        <div className="absolute inset-0 bg-white/10 skew-y-12 md:translate-y-20"></div>
                    </div>
                    <div className="md:hidden mt-2 font-bold text-orange-400 text-lg">3rd</div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-10 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 md:pt-0 mb-8">
                <div className="space-y-1">
                    <h2 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 tracking-tight">
                        {isAdmin ? 'MGC Group Leaderboard' : `Welcome Back, ${currentUser?.name}!`}
                    </h2>
                    <p className="text-slate-500 text-base md:text-lg">
                        {isAdmin ? 'Celebrating excellence and teamwork across the organization' : 'Stay updated with your team and the company leaderboard.'}
                    </p>
                </div>
            </div>

            {/* My Team Highlight for Members */}
            {!isAdmin && myTeam && (
                <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group mb-10">
                    <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-12 -translate-y-12 rotate-12 group-hover:scale-110 transition-transform duration-700">
                        <Star size={240} fill="white" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner border border-white/30 transform group-hover:rotate-6 transition-transform">
                                <Users size={40} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold uppercase tracking-widest border border-white/20">Your Team</span>
                                    <span className="px-2 py-0.5 bg-amber-400 text-indigo-900 rounded text-[10px] font-black uppercase tracking-widest shadow-lg">Rank #{myTeamRank}</span>
                                </div>
                                <h3 className="text-3xl font-black">{myTeam.name}</h3>
                                <p className="text-indigo-100 mt-1 opacity-90 font-medium flex items-center gap-2">
                                    <Activity size={14} /> Total Points: <span className="text-white font-bold">{myTeam.points || 0}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex -space-x-3">
                                {employees.filter(e => e.teamId === myTeam.id).slice(0, 5).map((m, i) => (
                                    <div key={m.id} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border-2 border-indigo-600 flex items-center justify-center text-[10px] font-bold shadow-lg" title={m.name}>
                                        {m.name.charAt(0)}
                                    </div>
                                ))}
                                {employees.filter(e => e.teamId === myTeam.id).length > 5 && (
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border-2 border-indigo-600 flex items-center justify-center text-[10px] font-bold shadow-lg">
                                        +{employees.filter(e => e.teamId === myTeam.id).length - 5}
                                    </div>
                                )}
                            </div>
                            <Link
                                to="/employees"
                                className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-white/90 transition-all shadow-xl flex items-center gap-2 group/btn"
                            >
                                Meet the Team <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Team Points */}
                <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Target size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Target size={18} />
                            </div>
                            <h3 className="text-xs font-semibold text-white/80">Total Points</h3>
                        </div>
                        <p className="text-3xl font-extrabold mt-2">{totalTeamPoints.toLocaleString()}</p>
                        <p className="text-xs text-white/70 mt-1">{teams.length} team{teams.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {/* Total Employees */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Users size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Users size={18} />
                            </div>
                            <h3 className="text-xs font-semibold text-white/80">Total Employees</h3>
                        </div>
                        <p className="text-3xl font-extrabold mt-2">{totalEmployees.toLocaleString()}</p>
                        <p className="text-xs text-white/70 mt-1">Active members</p>
                    </div>
                </div>

                {/* Top Performer */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Crown size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Crown size={18} />
                            </div>
                            <h3 className="text-xs font-semibold text-white/80">Top Performer</h3>
                        </div>
                        {rankedEmployees.length > 0 ? (
                            <>
                                <p className="text-lg font-bold mt-2 truncate">{rankedEmployees[0].name}</p>
                                <p className="text-xs text-white/70 mt-1">{rankedEmployees[0].points} points</p>
                            </>
                        ) : (
                            <p className="text-sm text-white/70 mt-2">No data</p>
                        )}
                    </div>
                </div>

                {/* Top Performing Team */}
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Trophy size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Trophy size={18} />
                            </div>
                            <h3 className="text-xs font-semibold text-white/80">Top Team</h3>
                        </div>
                        {rankedTeams.length > 0 ? (
                            <>
                                <p className="text-lg font-bold mt-2 truncate">{rankedTeams[0].name}</p>
                                <p className="text-xs text-white/70 mt-1">{rankedTeams[0].points} points</p>
                            </>
                        ) : (
                            <p className="text-sm text-white/70 mt-2">No data</p>
                        )}
                    </div>
                </div>
            </div>

            {teams.length > 0 ? <Podium winners={rankedTeams} /> : (
                <div className="p-12 text-center bg-white/50 rounded-3xl border border-dashed border-indigo-200 text-indigo-300 italic">
                    No teams available for the podium yet.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                {/* Chart Section - Expanded to 2 cols on Large */}
                <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-3xl shadow-sm border border-white/60 relative overflow-hidden bg-white/60 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                            <Activity className="text-indigo-500" /> Performance Analytics
                        </h3>
                    </div>
                    <div className="flex-1 space-y-3">
                        {teams.length > 0 ? (
                            rankedTeams.map((team, index) => {
                                const percentage = Math.round((team.points / maxPoints) * 100);
                                const isTopTeam = index === 0;
                                return (
                                    <div key={team.id} className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-slate-700 w-24 text-left">{team.name}</span>
                                        <div className="flex-1 h-10 bg-slate-200 rounded-md overflow-hidden relative">
                                            <div
                                                className={`h-full ${isTopTeam ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-slate-600 to-slate-700'} transition-all duration-500 flex items-center justify-end pr-3`}
                                                style={{ width: `${percentage}%` }}
                                            >
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-slate-700 w-12 text-right">{team.points}</span>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-slate-400 italic text-center py-8">No team data available</p>
                        )}
                    </div>
                </div>

                {/* Top Employees List */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/30 flex flex-col h-full">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Trophy size={140} />
                    </div>

                    <h3 className="font-bold text-xl mb-6 relative z-10 flex items-center gap-2">
                        <Crown /> Top Performers
                    </h3>

                    <div className="space-y-4 relative z-10 flex-1 overflow-y-auto custom-scrollbar lg:max-h-[400px]">
                        {rankedEmployees.map((emp, idx) => (
                            <div key={emp.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10 shadow-lg group">
                                <span className={`font-bold text-lg w-8 h-8 flex items-center justify-center rounded-lg ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : 'bg-white/20 text-white'}`}>
                                    {idx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-white truncate">{emp.name}</div>
                                    <div className="text-xs text-indigo-200 truncate">{emp.designation}</div>
                                </div>
                                <div className="font-bold text-white bg-white/20 px-2 py-1 rounded-lg text-sm whitespace-nowrap">
                                    {emp.points} pts
                                </div>
                            </div>
                        ))}
                        {rankedEmployees.length === 0 && <p className="text-indigo-200 italic">No data yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

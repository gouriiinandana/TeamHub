import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Users, Trophy, Gamepad2, Crown, UserCog, Mail, Phone, MapPin, Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyTeam = () => {
    const { currentUser } = useAuth();
    const { teams, employees, scheduledGames } = useData();

    // Find the current user in the employees list
    const myEmployee = useMemo(() => {
        return employees.find(emp => emp.email === currentUser?.email);
    }, [employees, currentUser]);

    // Find their team
    const team = useMemo(() => {
        if (!myEmployee || !myEmployee.teamId) return null;
        return teams.find(t => t.id === myEmployee.teamId);
    }, [myEmployee, teams]);

    // All members of this team
    const members = useMemo(() => {
        if (!team) return [];
        return employees.filter(e => e.teamId === team.id);
    }, [team, employees]);

    // Rankings
    const rankedTeams = useMemo(() => {
        return [...teams].sort((a, b) => (b.points || 0) - (a.points || 0));
    }, [teams]);

    const myTeamRank = useMemo(() => {
        if (!team) return null;
        return rankedTeams.findIndex(t => t.id === team.id) + 1;
    }, [team, rankedTeams]);

    // Games conducted by this team
    const teamGames = useMemo(() => {
        if (!team) return [];
        return scheduledGames.filter(game => game.conductingTeam === team.id);
    }, [team, scheduledGames]);

    const teamLead = members.find(m => m.role === 'Team Lead');
    const viceLead = members.find(m => m.role === 'Vice Lead');

    if (!team) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                    <Users size={48} />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">No Team Assigned</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                    You haven't been assigned to a team yet. Please contact your administrator to get assigned and see your teammates!
                </p>
                <Link to="/" className="mt-8 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            {/* Header / Hero Section */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-12 -translate-y-12 rotate-12 group-hover:scale-110 transition-transform duration-700">
                    <Users size={300} fill="white" />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">Your Official Team</span>
                        <span className="px-3 py-1 bg-amber-400 text-indigo-900 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">Rank #{myTeamRank}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">{team.name}</h1>

                    <div className="flex flex-wrap gap-6 md:gap-12">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-indigo-100/70 font-bold uppercase tracking-widest">Team Points</p>
                                <p className="text-2xl font-black">{team.points || 0}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-indigo-100/70 font-bold uppercase tracking-widest">Total Members</p>
                                <p className="text-2xl font-black">{members.length}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                <Gamepad2 size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-indigo-100/70 font-bold uppercase tracking-widest">Games Led</p>
                                <p className="text-2xl font-black">{teamGames.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Team Hierarchy & Stats */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Leadership Card */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-indigo-50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Crown className="text-amber-500" /> Team Leadership
                        </h3>

                        <div className="space-y-6">
                            {teamLead ? (
                                <div className="flex items-center gap-4 bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-100">
                                    <div className="w-14 h-14 rounded-xl bg-amber-400 flex items-center justify-center text-amber-900 font-bold text-xl shadow-md shrink-0">
                                        {teamLead.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Team Lead</p>
                                        <h4 className="font-bold text-slate-800 truncate">{teamLead.name}</h4>
                                        <p className="text-xs text-slate-500 truncate">{teamLead.designation}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 text-sm">
                                    No Team Lead assigned
                                </div>
                            )}

                            {viceLead ? (
                                <div className="flex items-center gap-4 bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-100">
                                    <div className="w-14 h-14 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
                                        {viceLead.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Vice Lead</p>
                                        <h4 className="font-bold text-slate-800 truncate">{viceLead.name}</h4>
                                        <p className="text-xs text-slate-500 truncate">{viceLead.designation}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 text-sm">
                                    No Vice Lead assigned
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Team Games Card */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-indigo-50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Gamepad2 className="text-pink-500" /> Recent Games
                        </h3>

                        <div className="space-y-4">
                            {teamGames.slice(0, 3).map(game => (
                                <div key={game.id} className="p-4 rounded-xl border border-slate-50 bg-slate-50/50">
                                    <h4 className="font-bold text-sm text-slate-800">{game.name}</h4>
                                    <p className="text-[10px] text-slate-400 mt-1">{new Date(game.dateTime).toLocaleDateString()}</p>
                                </div>
                            ))}
                            {teamGames.length === 0 && (
                                <p className="text-sm text-slate-400 italic text-center py-4">No games organized yet.</p>
                            )}
                            {teamGames.length > 3 && (
                                <p className="text-xs text-indigo-500 font-bold text-center hover:underline cursor-pointer">View all games</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Full Member List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-indigo-50 overflow-hidden">
                        <div className="p-8 border-b border-indigo-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">Team Members</h3>
                                <p className="text-slate-500 text-sm">All {members.length} members of {team.name}</p>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                <Users size={24} />
                            </div>
                        </div>

                        <div className="divide-y divide-indigo-50 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designation</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Contribution</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-indigo-50">
                                    {members.sort((a, b) => (b.points || 0) - (a.points || 0)).map(member => (
                                        <tr key={member.id} className={`hover:bg-indigo-50/30 transition-colors ${member.id === myEmployee?.id ? 'bg-indigo-50/50' : ''}`}>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-slate-800 text-sm truncate">{member.name}</span>
                                                            {member.id === myEmployee?.id && (
                                                                <span className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black rounded uppercase">You</span>
                                                            )}
                                                            {member.role === 'Team Lead' && <Crown size={12} className="text-amber-500" />}
                                                            {member.role === 'Vice Lead' && <UserCog size={12} className="text-indigo-400" />}
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 truncate">{member.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm text-slate-600 font-medium">{member.designation}</span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 font-bold text-xs">
                                                    <Star size={12} fill="currentColor" /> {member.points || 0}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 bg-slate-50/50 text-center">
                            <p className="text-xs text-slate-400">Total Team Achievement: <span className="font-bold text-slate-600">{team.points || 0} Points</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTeam;

import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Users, Gamepad2, Trophy, MoreHorizontal, Settings, X, Search, Crown, UserCog, Edit3, Clock, MapPin, Trash2 } from 'lucide-react';

const Teams = () => {
    const { teams, employees, createTeam, assignTeam, removeFromTeam, setTeamPoints, scheduledGames } = useData();
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === 'Admin';
    const [newTeamName, setNewTeamName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTeamId, setActiveTeamId] = useState(null);
    const [editingPointsTeamId, setEditingPointsTeamId] = useState(null);
    const [pointsInput, setPointsInput] = useState('');
    const [viewingGamesTeamId, setViewingGamesTeamId] = useState(null);

    const handleCreateTeam = (e) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;
        createTeam(newTeamName);
        setNewTeamName('');
        setIsModalOpen(false);
    };

    const handleEditPoints = (teamId, currentPoints) => {
        setEditingPointsTeamId(teamId);
        setPointsInput(currentPoints.toString());
    };

    const handleSavePoints = (teamId) => {
        const newPoints = parseInt(pointsInput);
        if (!isNaN(newPoints) && newPoints >= 0) {
            setTeamPoints(teamId, newPoints);
        }
        setEditingPointsTeamId(null);
        setPointsInput('');
    };

    const getTeamMembers = (teamId) => employees.filter(e => e.teamId === teamId);
    const getLeader = (teamId) => employees.find(e => e.teamId === teamId && e.role === 'Team Lead');
    const getGamesConducted = (teamId) => scheduledGames.filter(game => game.conductingTeam === teamId).length;

    return (
        <div className="space-y-8 pb-8 h-full flex flex-col">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-indigo-100 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">Teams Dashboard</h1>
                    <p className="text-slate-500 mt-1 text-sm md:text-base">View and manage all company teams</p>
                </div>


                {isAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={20} /> Add New Team
                    </button>
                )}
            </div>

            {/* Teams Grid - FULL WIDTH OPTIMIZED */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
                {teams.map(team => {
                    const members = getTeamMembers(team.id);
                    const leader = getLeader(team.id);
                    const gamesConducted = getGamesConducted(team.id);

                    return (
                        <div key={team.id} className="card-hover bg-white rounded-2xl p-1 shadow-sm h-full flex flex-col">
                            <div className="card-content p-6 rounded-xl flex flex-col h-full relative overflow-hidden group">

                                {/* Decorative background blob */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors"></div>

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <h3 className="text-2xl font-bold text-slate-800 truncate">{team.name}</h3>
                                        <p className="text-slate-400 text-sm font-medium truncate">Team {team.name}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        {editingPointsTeamId === team.id ? (
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="number"
                                                    value={pointsInput}
                                                    onChange={(e) => setPointsInput(e.target.value)}
                                                    className="w-20 px-2 py-1 border border-amber-300 rounded-lg text-sm font-bold text-center focus:ring-2 focus:ring-amber-400 outline-none"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSavePoints(team.id);
                                                        if (e.key === 'Escape') setEditingPointsTeamId(null);
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleSavePoints(team.id)}
                                                    className="px-2 py-1 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => setEditingPointsTeamId(null)}
                                                    className="px-2 py-1 bg-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-400"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="px-3 py-1 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-1 shadow-sm whitespace-nowrap group/points">
                                                <Trophy size={14} className="text-amber-500" />
                                                <span className="font-bold text-slate-700">{team.points}</span>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => handleEditPoints(team.id, team.points)}
                                                        className="ml-1 opacity-0 group-hover/points:opacity-100 transition-opacity p-1 hover:bg-amber-100 rounded"
                                                    >
                                                        <Edit3 size={12} className="text-amber-600" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        {leader && (
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase tracking-wide border border-indigo-100">
                                                LEAD
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 md:gap-6 mb-8 text-slate-500 text-sm relative z-10">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-indigo-400" />
                                        <span>{members.length} Members</span>
                                    </div>
                                    <button
                                        onClick={() => setViewingGamesTeamId(team.id)}
                                        className="flex items-center gap-2 hover:text-pink-600 transition-colors cursor-pointer"
                                    >
                                        <Gamepad2 size={16} className="text-pink-400" />
                                        <span>{gamesConducted} Games</span>
                                    </button>
                                </div>

                                <div className="mt-auto relative z-10">
                                    <button
                                        onClick={() => setActiveTeamId(team.id)}
                                        className="w-full py-3 bg-slate-50 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 hover:text-white text-slate-600 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-lg shadow-indigo-500/20"
                                    >
                                        {isAdmin ? 'Manage Team' : 'View Members'} <Settings size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create Team Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-float border border-white/50 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">Create New Team</h3>
                        <form onSubmit={handleCreateTeam} className="space-y-4">
                            <input
                                autoFocus
                                type="text"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                placeholder="Enter Team Name"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner"
                            />
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/30"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Games Conducted Modal */}
            {viewingGamesTeamId && (() => {
                const team = teams.find(t => t.id === viewingGamesTeamId);
                const teamGames = scheduledGames.filter(game => game.conductingTeam === viewingGamesTeamId);

                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-3xl w-full animate-float border border-white/50 relative overflow-hidden max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={() => setViewingGamesTeamId(null)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-20"
                            >
                                <X size={20} />
                            </button>

                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-violet-500"></div>

                            <div className="mb-6 mt-2">
                                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <Gamepad2 className="text-pink-500" size={28} />
                                    Games Conducted by {team?.name}
                                </h3>
                                <p className="text-slate-500 mt-1">Total: {teamGames.length} game{teamGames.length !== 1 ? 's' : ''}</p>
                            </div>

                            <div className="space-y-4">
                                {teamGames.length > 0 ? (
                                    teamGames.map(game => (
                                        <div key={game.id} className="bg-gradient-to-br from-pink-50 to-violet-50 rounded-2xl p-5 border border-pink-100 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-lg">{game.name}</h4>
                                                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold mt-2">
                                                        {game.gameType}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Clock size={16} className="text-indigo-400" />
                                                    {new Date(game.dateTime).toLocaleString()}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <MapPin size={16} className="text-pink-400" />
                                                    {game.location}
                                                </div>
                                                {game.description && (
                                                    <p className="text-slate-500 mt-3 text-sm bg-white/50 p-3 rounded-lg">
                                                        {game.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                                        <Gamepad2 size={48} className="mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No games conducted yet</p>
                                        <p className="text-sm mt-1">This team hasn't organized any games</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-200">
                                <button
                                    onClick={() => setViewingGamesTeamId(null)}
                                    className="w-full py-3 bg-gradient-to-r from-pink-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-pink-500/30 transform hover:-translate-y-1 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Manage Team Panel */}
            {activeTeamId && (
                <ManageTeamModal
                    teamId={activeTeamId}
                    onClose={() => setActiveTeamId(null)}
                    employees={employees}
                    assignTeam={assignTeam}
                    removeFromTeam={removeFromTeam}
                    teams={teams}
                />
            )}
        </div>
    );
};

// Sub-component for Manage Team
const ManageTeamModal = ({ teamId, onClose, employees, assignTeam, removeFromTeam, teams }) => {
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === 'Admin';
    const team = teams.find(t => t.id === teamId);
    const teamMembers = employees.filter(e => e.teamId === teamId);
    const [selectedEmp, setSelectedEmp] = useState('');
    const [selectedRole, setSelectedRole] = useState('Member');
    const [editingMember, setEditingMember] = useState(null);

    const handleAddMember = () => {
        if (selectedEmp) {
            assignTeam(selectedEmp, teamId, selectedRole);
            setSelectedEmp('');
            setSelectedRole('Member');
        }
    };

    const handleChangeRole = (memberId, newRole) => {
        assignTeam(memberId, teamId, newRole);
        setEditingMember(null);
    };

    const handleRemoveMember = (memberId) => {
        if (window.confirm('Are you sure you want to remove this member from the team?')) {
            removeFromTeam(memberId);
        }
    };

    const teamLead = teamMembers.find(m => m.role === 'Team Lead');
    const viceLead = teamMembers.find(m => m.role === 'Vice Lead');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-white/50 relative">
                {/* Close Button Mobile */}
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow text-slate-400 md:hidden">✕</button>

                {/* Header */}
                <div className="p-6 md:p-8 border-b border-indigo-50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-indigo-50/50 to-pink-50/50 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
                            {team.name}
                            <span className="text-indigo-200 hover:text-indigo-500 transition-colors cursor-pointer"><Settings size={20} /></span>
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base">Manage members and assign roles</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <div className="bg-white rounded-xl p-3 px-5 flex flex-col items-center border border-indigo-100 shadow-sm">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Team Score</span>
                            <div className="flex items-center gap-2">
                                <Trophy size={18} className="text-amber-500" />
                                <span className="text-xl font-black text-slate-800">{team.points}</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="hidden md:block p-2 hover:bg-white rounded-full text-slate-400 transition-colors">✕</button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h3 className="text-lg font-bold text-slate-700 w-full md:w-auto">Team Members</h3>
                        {isAdmin && (
                            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                                <div className="relative flex-1 md:flex-none">
                                    <select
                                        value={selectedEmp}
                                        onChange={(e) => setSelectedEmp(e.target.value)}
                                        className="w-full md:w-48 px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                    >
                                        <option value="">Select employee...</option>
                                        {employees.filter(e => !e.teamId).map(e => (
                                            <option key={e.id} value={e.id}>{e.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative flex-1 md:flex-none">
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full md:w-40 px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                    >
                                        <option value="Member">Member</option>
                                        <option value="Vice Lead" disabled={!!viceLead}>Vice Lead</option>
                                        <option value="Team Lead" disabled={!!teamLead}>Team Lead</option>
                                    </select>
                                </div>
                                <button
                                    onClick={handleAddMember}
                                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-indigo-500/30 transition-all shrink-0"
                                >
                                    + Add
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teamMembers.map(member => (
                            <div key={member.id} className="border border-indigo-50 bg-white rounded-2xl p-4 flex justify-between items-start hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all group">
                                <div className="flex gap-4 items-center flex-1 min-w-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-lg font-bold text-indigo-600 shrink-0">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-bold text-slate-800 truncate">{member.name}</h4>
                                            {member.role === 'Team Lead' && (
                                                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                                                    <Crown size={10} /> LEAD
                                                </span>
                                            )}
                                            {member.role === 'Vice Lead' && (
                                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                                                    <UserCog size={10} /> VICE
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 truncate">{member.designation}</p>
                                        <p className="text-xs text-slate-300 mt-1 font-mono">{member.empId}</p>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setEditingMember(editingMember === member.id ? null : member.id)}
                                            className="text-slate-300 hover:text-indigo-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>

                                        {/* Role Change Dropdown */}
                                        {editingMember === member.id && (
                                            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 min-w-[140px] overflow-hidden">
                                                <div className="p-2">
                                                    <p className="text-xs font-semibold text-slate-400 px-2 py-1">Change Role</p>
                                                    <button
                                                        onClick={() => handleChangeRole(member.id, 'Member')}
                                                        disabled={member.role === 'Member'}
                                                        className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-indigo-50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Member
                                                    </button>
                                                    <button
                                                        onClick={() => handleChangeRole(member.id, 'Vice Lead')}
                                                        disabled={member.role === 'Vice Lead' || (!!viceLead && viceLead.id !== member.id)}
                                                        className="w-full px-3 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        <UserCog size={14} /> Vice Lead
                                                    </button>
                                                    <button
                                                        onClick={() => handleChangeRole(member.id, 'Team Lead')}
                                                        disabled={member.role === 'Team Lead' || (!!teamLead && teamLead.id !== member.id)}
                                                        className="w-full px-3 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        <Crown size={14} /> Team Lead
                                                    </button>
                                                    <div className="border-t border-slate-100 my-1"></div>
                                                    <button
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-medium"
                                                    >
                                                        <Trash2 size={14} /> Remove from Team
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {teamMembers.length === 0 && (
                            <div className="col-span-full py-10 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                                No members in this team yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Teams;

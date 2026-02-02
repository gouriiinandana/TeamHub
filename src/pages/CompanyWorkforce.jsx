import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Building2, Users, Plus, Trash2, UserPlus, UserMinus, Megaphone, AlertCircle, X, Edit2, Gamepad2, Calendar, MapPin, Clock, Smile } from 'lucide-react';

const CompanyWorkforce = () => {
    const {
        employees,
        workforceTeams,
        announcements,
        createWorkforceTeam,
        updateWorkforceTeam,
        deleteWorkforceTeam,
        addMemberToWorkforceTeam,
        removeMemberFromWorkforceTeam,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        addReactionToAnnouncement,
        scheduledGames,
        scheduleGame,
        updateScheduledGame,
        teams
    } = useData();

    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === 'Admin';

    const [showTeamModal, setShowTeamModal] = useState(false);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamForm, setTeamForm] = useState({ name: '', type: 'official', description: '', lead: '' });
    const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', priority: 'medium' });
    const [showGameModal, setShowGameModal] = useState(false);
    const [gameForm, setGameForm] = useState({ name: '', dateTime: '', location: '', gameType: '', description: '', conductingTeam: '' });
    const [showReactionPicker, setShowReactionPicker] = useState(null);
    const [showReactionModal, setShowReactionModal] = useState(null);

    // Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const managementTeams = workforceTeams.filter(t => t.type === 'management');
    const officialTeams = workforceTeams.filter(t => t.type === 'official');

    const handleCreateTeam = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateWorkforceTeam(editingId, teamForm);
        } else {
            createWorkforceTeam(teamForm);
        }
        resetTeamForm();
    };

    const resetTeamForm = () => {
        setTeamForm({ name: '', type: 'official', description: '', lead: '' });
        setShowTeamModal(false);
        setIsEditing(false);
        setEditingId(null);
    };

    const handleEditTeam = (team) => {
        setTeamForm({
            name: team.name,
            type: team.type,
            description: team.description || '',
            lead: team.lead || ''
        });
        setEditingId(team.id);
        setIsEditing(true);
        setShowTeamModal(true);
    };

    const handleAddMember = (teamId, employeeId) => {
        addMemberToWorkforceTeam(teamId, employeeId);
        setShowMemberModal(false);
        setSelectedTeam(null);
    };

    const handleCreateAnnouncement = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateAnnouncement(editingId, announcementForm);
        } else {
            addAnnouncement(announcementForm);
        }
        resetAnnouncementForm();
    };

    const resetAnnouncementForm = () => {
        setAnnouncementForm({ title: '', content: '', priority: 'medium' });
        setShowAnnouncementModal(false);
        setIsEditing(false);
        setEditingId(null);
    };

    const handleEditAnnouncement = (announcement) => {
        setAnnouncementForm({
            title: announcement.title,
            content: announcement.content,
            priority: announcement.priority
        });
        setEditingId(announcement.id);
        setIsEditing(true);
        setShowAnnouncementModal(true);
    };

    const handleScheduleGame = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateScheduledGame(editingId, gameForm);
        } else {
            scheduleGame(gameForm);
        }
        resetGameForm();
    };

    const resetGameForm = () => {
        setGameForm({ name: '', dateTime: '', location: '', gameType: '', description: '', conductingTeam: '' });
        setShowGameModal(false);
        setIsEditing(false);
        setEditingId(null);
    };

    const handleEditGame = (game) => {
        setGameForm({
            name: game.name,
            dateTime: game.dateTime,
            location: game.location,
            gameType: game.gameType,
            description: game.description || '',
            conductingTeam: game.conductingTeam || ''
        });
        setEditingId(game.id);
        setIsEditing(true);
        setShowGameModal(true);
    };

    const getEmployeeName = (employeeId) => {
        const emp = employees.find(e => e.id === employeeId);
        return emp ? emp.name : 'Unknown';
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700 border-red-300';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'low': return 'bg-green-100 text-green-700 border-green-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const TeamCard = ({ team }) => (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-indigo-100 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{team.name}</h3>
                    <p className="text-sm text-slate-500">{team.description}</p>
                    {team.lead && (
                        <p className="text-xs text-indigo-600 mt-2">Lead: {getEmployeeName(team.lead)}</p>
                    )}
                </div>
                {isAdmin && (
                    <div className="flex gap-1">
                        <button
                            onClick={() => handleEditTeam(team)}
                            className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button
                            onClick={() => deleteWorkforceTeam(team.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">Members ({team.members?.length || 0})</span>
                    {isAdmin && (
                        <button
                            onClick={() => {
                                setSelectedTeam(team);
                                setShowMemberModal(true);
                            }}
                            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                            <UserPlus size={16} />
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {team.members?.map(memberId => (
                        <div key={memberId} className="flex items-center gap-1 bg-indigo-50 px-3 py-1 rounded-full text-sm">
                            <span className="text-indigo-700">{getEmployeeName(memberId)}</span>
                            {isAdmin && (
                                <button
                                    onClick={() => removeMemberFromWorkforceTeam(team.id, memberId)}
                                    className="text-indigo-400 hover:text-indigo-600"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    {(!team.members || team.members.length === 0) && (
                        <p className="text-sm text-slate-400 italic">No members yet</p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="pb-6 border-b border-indigo-100">
                <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight flex items-center gap-3">
                    <Building2 size={36} className="text-indigo-600" />
                    Company Workforce
                </h1>
                <p className="text-slate-500 mt-1 text-sm md:text-base">Manage company teams and announcements</p>
            </div>

            {/* Announcements Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 md:p-8 border border-amber-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Megaphone size={24} className="text-amber-600" />
                        Announcements
                    </h2>
                    {isAdmin && (
                        <button
                            onClick={() => {
                                resetAnnouncementForm();
                                setShowAnnouncementModal(true);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <Plus size={18} />
                            New Announcement
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {announcements.length > 0 ? (
                        announcements.slice(0, 5).map(announcement => {
                            const reactions = announcement.reactions || {};
                            const availableEmojis = ['👍', '❤️', '😊', '🎉', '👏', '🔥'];

                            return (
                                <div key={announcement.id} className="bg-white rounded-xl p-4 border-l-4 border-amber-500">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-bold text-slate-800">{announcement.title}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(announcement.priority)}`}>
                                                    {announcement.priority}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600">{announcement.content}</p>
                                            <p className="text-xs text-slate-400 mt-2">
                                                {new Date(announcement.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {isAdmin && (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleEditAnnouncement(announcement)}
                                                    className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteAnnouncement(announcement.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Reactions Section */}
                                    <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-slate-100">
                                        {/* Display existing reactions */}
                                        {Object.entries(reactions).map(([emoji, employeeIds]) => (
                                            employeeIds.length > 0 && (
                                                <button
                                                    key={emoji}
                                                    onClick={() => setShowReactionModal({ announcementId: announcement.id, emoji, employeeIds })}
                                                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all ${currentUser && employeeIds.includes(currentUser.id)
                                                        ? 'bg-indigo-100 border-2 border-indigo-400'
                                                        : 'bg-slate-100 border border-slate-200 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    <span>{emoji}</span>
                                                    <span className="text-xs font-semibold text-slate-700">{employeeIds.length}</span>
                                                </button>
                                            )
                                        ))}

                                        {/* Add reaction button */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowReactionPicker(showReactionPicker === announcement.id ? null : announcement.id)}
                                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                title="Add reaction"
                                            >
                                                <Smile size={18} />
                                            </button>

                                            {/* Emoji Picker Popup */}
                                            {showReactionPicker === announcement.id && (
                                                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-slate-200 p-2 flex gap-1 z-10">
                                                    {availableEmojis.map(emoji => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => {
                                                                if (currentUser) {
                                                                    addReactionToAnnouncement(announcement.id, emoji, currentUser.id);
                                                                    setShowReactionPicker(null);
                                                                }
                                                            }}
                                                            className="text-2xl hover:scale-125 transition-transform p-1"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-amber-600 italic py-8">No announcements yet</p>
                    )}
                </div>
            </div>

            {/* Workforce Games Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl p-6 md:p-8 border border-indigo-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Gamepad2 size={24} className="text-indigo-600" />
                        Workforce Activities & Games
                    </h2>
                    {isAdmin && (
                        <button
                            onClick={() => {
                                resetGameForm();
                                setShowGameModal(true);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Schedule Activity
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scheduledGames.filter(g => workforceTeams.some(wt => wt.id === g.conductingTeam)).length > 0 ? (
                        scheduledGames.filter(g => workforceTeams.some(wt => wt.id === g.conductingTeam)).map(game => (
                            <div key={game.id} className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 flex flex-col group relative">
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditGame(game)}
                                            className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                )}
                                <h3 className="font-bold text-slate-800 mb-3 pr-8">{game.name}</h3>
                                <div className="space-y-2 text-sm text-slate-600 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-indigo-400" />
                                        {new Date(game.dateTime).toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-pink-400" />
                                        {game.location}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-emerald-400" />
                                        <span>By: {workforceTeams.find(wt => wt.id === game.conductingTeam)?.name}</span>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">
                                        {game.gameType}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-slate-400 italic py-8 col-span-full">No activities scheduled by workforce teams</p>
                    )}
                </div>
            </div>

            {/* Management Teams */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Users size={24} className="text-indigo-600" />
                        Management Teams
                    </h2>
                    {isAdmin && (
                        <button
                            onClick={() => {
                                resetTeamForm();
                                setTeamForm({ ...teamForm, type: 'management' });
                                setShowTeamModal(true);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add Team
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {managementTeams.length > 0 ? (
                        managementTeams.map(team => <TeamCard key={team.id} team={team} />)
                    ) : (
                        <p className="text-slate-400 italic col-span-full text-center py-8">No management teams yet</p>
                    )}
                </div>
            </div>

            {/* Official Teams */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Building2 size={24} className="text-emerald-600" />
                        Official Teams
                    </h2>
                    {isAdmin && (
                        <button
                            onClick={() => {
                                resetTeamForm();
                                setTeamForm({ ...teamForm, type: 'official' });
                                setShowTeamModal(true);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add Team
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {officialTeams.length > 0 ? (
                        officialTeams.map(team => <TeamCard key={team.id} team={team} />)
                    ) : (
                        <p className="text-slate-400 italic col-span-full text-center py-8">No official teams yet</p>
                    )}
                </div>
            </div>

            {/* Team Modal */}
            {showTeamModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">{isEditing ? 'Edit Team' : 'Create New Team'}</h3>
                        <form onSubmit={handleCreateTeam} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Team Name</label>
                                <input
                                    type="text"
                                    value={teamForm.name}
                                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                <textarea
                                    value={teamForm.description}
                                    onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Team Lead</label>
                                <select
                                    value={teamForm.lead}
                                    onChange={(e) => setTeamForm({ ...teamForm, lead: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                                >
                                    <option value="">Select Lead</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                >
                                    {isEditing ? 'Update Team' : 'Create Team'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetTeamForm}
                                    className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Member Modal */}
            {showMemberModal && selectedTeam && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Add Member to {selectedTeam.name}</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {employees.filter(emp => !selectedTeam.members?.includes(emp.id)).map(emp => (
                                <button
                                    key={emp.id}
                                    onClick={() => handleAddMember(selectedTeam.id, emp.id)}
                                    className="w-full p-3 text-left bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                                >
                                    <div className="font-semibold text-slate-800">{emp.name}</div>
                                    <div className="text-sm text-slate-500">{emp.designation}</div>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                setShowMemberModal(false);
                                setSelectedTeam(null);
                            }}
                            className="w-full mt-4 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Announcement Modal */}
            {showAnnouncementModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">{isEditing ? 'Edit Announcement' : 'Create Announcement'}</h3>
                        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={announcementForm.title}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-400 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Content</label>
                                <textarea
                                    value={announcementForm.content}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-400 outline-none"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                                <select
                                    value={announcementForm.priority}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-400 outline-none"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                >
                                    {isEditing ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetAnnouncementForm}
                                    className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Game Modal */}
            {showGameModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">{isEditing ? 'Edit Activity' : 'Schedule New Activity'}</h3>
                        <form onSubmit={handleScheduleGame} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Activity Name</label>
                                <input
                                    type="text"
                                    value={gameForm.name}
                                    onChange={(e) => setGameForm({ ...gameForm, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={gameForm.dateTime}
                                        onChange={(e) => setGameForm({ ...gameForm, dateTime: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Activity Type</label>
                                    <select
                                        value={gameForm.gameType}
                                        onChange={(e) => setGameForm({ ...gameForm, gameType: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Meeting">Meeting</option>
                                        <option value="Training">Training</option>
                                        <option value="Game">Game</option>
                                        <option value="Team Building">Team Building</option>
                                        <option value="Announcement">Announcement Event</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Conducting Workforce Team</label>
                                <select
                                    value={gameForm.conductingTeam}
                                    onChange={(e) => setGameForm({ ...gameForm, conductingTeam: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                                    required
                                >
                                    <option value="">Select Workforce Team</option>
                                    {workforceTeams.map(wt => (
                                        <option key={wt.id} value={wt.id}>{wt.name} ({wt.type})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={gameForm.location}
                                    onChange={(e) => setGameForm({ ...gameForm, location: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                <textarea
                                    value={gameForm.description}
                                    onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                                    rows="3"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                >
                                    {isEditing ? 'Update Activity' : 'Schedule'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetGameForm}
                                    className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reaction Modal - Show who reacted */}
            {showReactionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowReactionModal(null)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="text-3xl">{showReactionModal.emoji}</span>
                                <span>Reactions</span>
                            </h3>
                            <button
                                onClick={() => setShowReactionModal(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {showReactionModal.employeeIds.map(empId => {
                                const emp = employees.find(e => e.id === empId);
                                return emp ? (
                                    <div key={empId} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                                            {emp.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800">{emp.name}</div>
                                            <div className="text-sm text-slate-500">{emp.designation}</div>
                                        </div>
                                    </div>
                                ) : null;
                            })}
                        </div>
                        <button
                            onClick={() => setShowReactionModal(null)}
                            className="w-full mt-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyWorkforce;

import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Trophy, Medal, User, Users, PlusCircle, History, Calendar, MapPin, Clock, Edit2, Trash2, X, Gamepad2 } from 'lucide-react';

const Games = () => {
    const { teams, employees, updateTeamPoints, updateEmployeePoints, addGame, games, scheduledGames, scheduleGame, updateScheduledGame, deleteScheduledGame } = useData();

    const [activeTab, setActiveTab] = useState('schedule'); // schedule, award, history
    const [targetType, setTargetType] = useState('team'); // team, employee
    const [selectedId, setSelectedId] = useState('');
    const [points, setPoints] = useState('');
    const [reason, setReason] = useState('');

    // Schedule Game Form State
    const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingGameId, setEditingGameId] = useState(null);
    const [scheduleFormData, setScheduleFormData] = useState({
        name: '',
        dateTime: '',
        location: '',
        gameType: '',
        description: '',
        conductingTeam: ''
    });

    const handleAwardPoints = (e) => {
        e.preventDefault();
        console.log('🎮 handleAwardPoints called');
        if (!selectedId || !points) return;

        const pointsNum = parseInt(points);
        const activityName = reason || 'Game Activity';

        console.log('🎯 Awarding points:', { targetType, selectedId, pointsNum, activityName });

        if (targetType === 'team') {
            updateTeamPoints(selectedId, pointsNum);
            addGame({
                name: activityName,
                date: new Date().toISOString(),
                teamScores: [{ teamId: selectedId, points: pointsNum }]
            });
        } else {
            console.log('👤 Calling updateEmployeePoints for individual');
            updateEmployeePoints(selectedId, pointsNum);
            addGame({
                name: activityName,
                date: new Date().toISOString(),
                employeeScores: [{ empId: selectedId, points: pointsNum }]
            });
        }

        setPoints('');
        setReason('');
        alert(`Awarded ${pointsNum} points!`);
    };

    const handleScheduleGame = (e) => {
        e.preventDefault();
        if (isEditMode) {
            updateScheduledGame(editingGameId, scheduleFormData);
        } else {
            scheduleGame(scheduleFormData);
        }
        setIsScheduleFormOpen(false);
        setIsEditMode(false);
        setEditingGameId(null);
        setScheduleFormData({ name: '', dateTime: '', location: '', gameType: '', description: '', conductingTeam: '' });
    };

    const handleEditScheduledGame = (game) => {
        setScheduleFormData({
            name: game.name,
            dateTime: game.dateTime,
            location: game.location,
            gameType: game.gameType,
            description: game.description,
            conductingTeam: game.conductingTeam || ''
        });
        setEditingGameId(game.id);
        setIsEditMode(true);
        setIsScheduleFormOpen(true);
    };

    const handleDeleteScheduledGame = (gameId) => {
        if (window.confirm('Are you sure you want to delete this scheduled game?')) {
            deleteScheduledGame(gameId);
        }
    };

    return (
        <div className="space-y-8 pb-8">
            <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-600">
                    Games Arena
                </h2>
                <p className="text-slate-500">Schedule games and award points</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`px-6 py-3 font-semibold transition-all border-b-2 ${activeTab === 'schedule' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2">
                        <Calendar size={18} /> Schedule Game
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('award')}
                    className={`px-6 py-3 font-semibold transition-all border-b-2 ${activeTab === 'award' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2">
                        <Trophy size={18} /> Award Points
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-3 font-semibold transition-all border-b-2 ${activeTab === 'history' ? 'border-slate-600 text-slate-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2">
                        <History size={18} /> History
                    </div>
                </button>
            </div>

            {/* Schedule Game Tab */}
            {activeTab === 'schedule' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-800">Upcoming Games</h3>
                        <button
                            onClick={() => {
                                setIsEditMode(false);
                                setScheduleFormData({ name: '', dateTime: '', location: '', gameType: '', description: '' });
                                setIsScheduleFormOpen(true);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-xl shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 transition-all"
                        >
                            <PlusCircle size={18} /> Schedule New Game
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scheduledGames.map(game => (
                            <div key={game.id} className="glass-panel bg-white/80 p-6 rounded-2xl border border-white/50 hover:shadow-lg transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <Gamepad2 className="text-indigo-500" size={24} />
                                        <h4 className="font-bold text-slate-800 text-lg">{game.name}</h4>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditScheduledGame(game)}
                                            className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-500 transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteScheduledGame(game.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
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
                                    {game.conductingTeam && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Users size={16} className="text-green-400" />
                                            <span>Conducted by: <span className="font-semibold">{teams.find(t => t.id === game.conductingTeam)?.name || 'Unknown Team'}</span></span>
                                        </div>
                                    )}
                                    <div className="mt-3">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">
                                            {game.gameType}
                                        </span>
                                    </div>
                                    {game.description && (
                                        <p className="text-slate-500 mt-3 text-xs line-clamp-2">{game.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {scheduledGames.length === 0 && (
                            <div className="col-span-full p-12 text-center bg-white/50 rounded-3xl border border-dashed border-indigo-200 text-indigo-300 italic">
                                No upcoming games scheduled yet.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Award Points Tab */}
            {activeTab === 'award' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Trophy size={120} />
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <PlusCircle className="text-amber-500" />
                                Award Points
                            </h3>

                            <form onSubmit={handleAwardPoints} className="space-y-6 relative z-10">
                                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                                    <button
                                        type="button"
                                        onClick={() => { setTargetType('team'); setSelectedId(''); }}
                                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${targetType === 'team' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Users size={16} /> Teams
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setTargetType('employee'); setSelectedId(''); }}
                                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${targetType === 'employee' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <User size={16} /> Individual
                                        </div>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Recipient</label>
                                        <select
                                            value={selectedId}
                                            onChange={(e) => setSelectedId(e.target.value)}
                                            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                            required
                                        >
                                            <option value="">Select {targetType === 'team' ? 'Team' : 'Employee'}</option>
                                            {targetType === 'team'
                                                ? teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
                                                : employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.empId})</option>)
                                            }
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Points</label>
                                        <input
                                            type="number"
                                            value={points}
                                            onChange={(e) => setPoints(e.target.value)}
                                            placeholder="e.g. 50"
                                            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Activity / Reason</label>
                                    <input
                                        type="text"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="e.g. Weekly Trivia Winner"
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-1 transition-all"
                                >
                                    Award Points
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white/50 backdrop-blur rounded-2xl p-6 border border-white/40 h-fit">
                        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <History size={20} className="text-slate-400" />
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {games.slice().reverse().slice(0, 5).map(game => (
                                <div key={game.id} className="text-sm p-3 bg-white rounded-lg shadow-sm border border-slate-100">
                                    <div className="font-semibold text-slate-800">{game.name}</div>
                                    <div className="text-xs text-slate-500">{new Date(game.date).toLocaleDateString()}</div>
                                    <div className="mt-1 text-slate-600">
                                        {game.teamScores && game.teamScores.map(s => {
                                            const t = teams.find(team => team.id === s.teamId);
                                            return <span key={s.teamId} className="text-amber-600 block">+{s.points} to {t?.name || 'Unknown Team'}</span>
                                        })}
                                        {game.employeeScores && game.employeeScores.map(s => {
                                            const e = employees.find(emp => emp.id === s.empId);
                                            return <span key={s.empId} className="text-indigo-600 block">+{s.points} to {e?.name || 'Unknown'}</span>
                                        })}
                                    </div>
                                </div>
                            ))}
                            {games.length === 0 && <p className="text-slate-400 text-sm">No games recorded yet.</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800">Game History</h3>
                    <div className="space-y-3">
                        {games.slice().reverse().map(game => (
                            <div key={game.id} className="glass-panel bg-white/80 p-6 rounded-xl border border-white/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg">{game.name}</h4>
                                        <p className="text-sm text-slate-500">{new Date(game.date).toLocaleString()}</p>
                                    </div>
                                    <Trophy className="text-amber-500" size={24} />
                                </div>
                                <div className="mt-4 space-y-2">
                                    {game.teamScores && game.teamScores.map(s => {
                                        const t = teams.find(team => team.id === s.teamId);
                                        return (
                                            <div key={s.teamId} className="flex items-center justify-between bg-amber-50 px-4 py-2 rounded-lg">
                                                <span className="font-medium text-slate-700">{t?.name || 'Unknown Team'}</span>
                                                <span className="font-bold text-amber-600">+{s.points} pts</span>
                                            </div>
                                        );
                                    })}
                                    {game.employeeScores && game.employeeScores.map(s => {
                                        const e = employees.find(emp => emp.id === s.empId);
                                        return (
                                            <div key={s.empId} className="flex items-center justify-between bg-indigo-50 px-4 py-2 rounded-lg">
                                                <span className="font-medium text-slate-700">{e?.name || 'Unknown'}</span>
                                                <span className="font-bold text-indigo-600">+{s.points} pts</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                        {games.length === 0 && (
                            <div className="p-12 text-center bg-white/50 rounded-3xl border border-dashed border-slate-200 text-slate-400 italic">
                                No game history yet.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Schedule Game Modal */}
            {isScheduleFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-2xl w-full animate-float border border-white/50 relative overflow-hidden max-h-[90vh] overflow-y-auto">
                        <button onClick={() => {
                            setIsScheduleFormOpen(false);
                            setIsEditMode(false);
                            setScheduleFormData({ name: '', dateTime: '', location: '', gameType: '', description: '', conductingTeam: '' });
                        }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-20"><X size={20} /></button>
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-pink-500"></div>
                        <h3 className="text-2xl font-bold mb-6 text-slate-800 mt-2">
                            {isEditMode ? 'Edit Scheduled Game' : 'Schedule New Game'}
                        </h3>
                        <form onSubmit={handleScheduleGame} className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-500 ml-1">Game Name</label>
                                <input type="text" placeholder="e.g. Team Trivia Night" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                                    value={scheduleFormData.name} onChange={e => setScheduleFormData({ ...scheduleFormData, name: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-500 ml-1">Date & Time</label>
                                    <input type="datetime-local" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                                        value={scheduleFormData.dateTime} onChange={e => setScheduleFormData({ ...scheduleFormData, dateTime: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-500 ml-1">Game Type</label>
                                    <select className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                                        value={scheduleFormData.gameType} onChange={e => setScheduleFormData({ ...scheduleFormData, gameType: e.target.value })} required>
                                        <option value="">Select Type</option>
                                        <option value="Trivia">Trivia</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Team Building">Team Building</option>
                                        <option value="Board Game">Board Game</option>
                                        <option value="Video Game">Video Game</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-500 ml-1">Conducting Team</label>
                                <select className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                                    value={scheduleFormData.conductingTeam} onChange={e => setScheduleFormData({ ...scheduleFormData, conductingTeam: e.target.value })}>
                                    <option value="">Select Team (Optional)</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>{team.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-500 ml-1">Location</label>
                                <input type="text" placeholder="e.g. Conference Room A" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                                    value={scheduleFormData.location} onChange={e => setScheduleFormData({ ...scheduleFormData, location: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-500 ml-1">Description / How to Play</label>
                                <textarea placeholder="Describe the game and how it will be played..." rows="4" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none resize-none"
                                    value={scheduleFormData.description} onChange={e => setScheduleFormData({ ...scheduleFormData, description: e.target.value })} />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => {
                                    setIsScheduleFormOpen(false);
                                    setIsEditMode(false);
                                    setScheduleFormData({ name: '', dateTime: '', location: '', gameType: '', description: '', conductingTeam: '' });
                                }} className="flex-1 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all">
                                    {isEditMode ? 'Update Game' : 'Schedule Game'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Games;

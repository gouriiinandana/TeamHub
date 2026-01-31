import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
    ShieldCheck,
    Users,
    Settings,
    Activity,
    Database,
    CheckCircle,
    XCircle,
    UserCog,
    Search,
    RefreshCw,
    TrendingUp,
    Briefcase,
    Gamepad2,
    Calendar,
    Trash2,
    Edit2,
    RotateCcw,
    X
} from 'lucide-react';

const AdminPanel = () => {
    const {
        employees,
        teams,
        games,
        scheduledGames,
        workforceTeams,
        activities,
        systemSettings,
        updateSystemSettings,
        updateUserRole,
        toggleUserStatus,
        updateEmployee,
        deleteEmployee,
        setEmployeePoints,
        clearData
    } = useData();

    const [activeTab, setActiveTab] = useState('users');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showResetPointsModal, setShowResetPointsModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Edit form state
    const [editForm, setEditForm] = useState({
        name: '',
        empId: '',
        designation: '',
        email: ''
    });

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.empId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (emp) => {
        setSelectedEmployee(emp);
        setEditForm({
            name: emp.name,
            empId: emp.empId,
            designation: emp.designation,
            email: emp.email || ''
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        updateEmployee(selectedEmployee.id, editForm);
        setShowEditModal(false);
        setSelectedEmployee(null);
    };

    const handleDeleteClick = (emp) => {
        setSelectedEmployee(emp);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        deleteEmployee(selectedEmployee.id);
        setShowDeleteModal(false);
        setSelectedEmployee(null);
    };

    const handleResetPointsClick = (emp) => {
        setSelectedEmployee(emp);
        setShowResetPointsModal(true);
    };

    const handleResetPointsConfirm = () => {
        setEmployeePoints(selectedEmployee.id, 0);
        setShowResetPointsModal(false);
        setSelectedEmployee(null);
    };

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
                    <Icon size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="text-2xl font-bold text-slate-800">{value}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="pb-6 border-b border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight flex items-center gap-3">
                        <ShieldCheck size={36} className="text-indigo-600" />
                        Admin Command Center
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm md:text-base">Global system management and oversight</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.location.reload()}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
                        Super Admin
                    </span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Employees" value={employees.length} color="indigo" />
                <StatCard icon={Briefcase} label="Active Teams" value={teams.length + workforceTeams.length} color="emerald" />
                <StatCard icon={Gamepad2} label="Games Played" value={games.length} color="amber" />
                <StatCard icon={Calendar} label="Upcoming Events" value={scheduledGames.length} color="violet" />
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-100 overflow-x-auto">
                    {[
                        { id: 'users', label: 'User Management', icon: UserCog },
                        { id: 'activities', label: 'Activity Logs', icon: Activity },
                        { id: 'settings', label: 'System Settings', icon: Settings },
                        { id: 'database', label: 'Database Tools', icon: Database },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id
                                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Panels */}
                <div className="p-6">
                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or Employee ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="text-sm text-slate-500">
                                    Showing {filteredEmployees.length} users
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-100">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Employee</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Team</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredEmployees.map(emp => (
                                            <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-bold text-slate-800">{emp.name}</div>
                                                        <div className="text-xs text-slate-500">{emp.empId} • {emp.designation}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={emp.role}
                                                        onChange={(e) => updateUserRole(emp.id, e.target.value)}
                                                        className="text-sm border-none bg-transparent font-medium text-slate-700 focus:ring-0 cursor-pointer"
                                                    >
                                                        <option value="Admin">Admin</option>
                                                        <option value="Member">Member</option>
                                                        <option value="Lead">Lead</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleUserStatus(emp.id)}
                                                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${emp.status === 'Active'
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-red-50 text-red-700'
                                                            }`}
                                                    >
                                                        {emp.status === 'Active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                        {emp.status}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-600">
                                                        {teams.find(t => t.id === emp.teamId)?.name || 'Directing'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => handleEditClick(emp)}
                                                            className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                                                            title="Edit Employee"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleResetPointsClick(emp)}
                                                            className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                                                            title="Reset Points"
                                                        >
                                                            <RotateCcw size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(emp)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Delete Employee"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activities' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Activity size={18} className="text-indigo-600" />
                                    Recent System Activities
                                </h3>
                                <div className="text-xs text-slate-500">Auto-refreshing log</div>
                            </div>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                                {activities.length > 0 ? activities.map(activity => (
                                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-all group">
                                        <div className={`mt-1 p-2 rounded-lg ${activity.type === 'user' ? 'bg-indigo-100 text-indigo-600' :
                                            activity.type === 'settings' ? 'bg-amber-100 text-amber-600' :
                                                'bg-emerald-100 text-emerald-600'
                                            }`}>
                                            {activity.type === 'user' ? <Users size={16} /> :
                                                activity.type === 'settings' ? <Settings size={16} /> : <Database size={16} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                <span className="font-bold text-slate-700 text-sm">{activity.action}</span>
                                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                                                    {new Date(activity.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">By {activity.user}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-slate-400 italic">No activities recorded yet</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-2xl space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-indigo-600" />
                                    General Application Settings
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Application Name</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={systemSettings.appName}
                                                onChange={(e) => updateSystemSettings({ appName: e.target.value })}
                                                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-slate-700">Primary Brand Color</label>
                                        <div className="flex flex-wrap gap-4">
                                            {['indigo', 'emerald', 'rose', 'amber', 'violet', 'slate'].map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => updateSystemSettings({ primaryColor: color })}
                                                    className={`w-10 h-10 rounded-full bg-${color}-500 border-4 transition-all opacity-80 hover:opacity-100 ${systemSettings.primaryColor === color ? 'border-white ring-2 ring-indigo-500 opacity-100 scale-110 shadow-lg' : 'border-transparent'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 text-center sm:text-left">
                                <h4 className="text-sm font-bold text-red-600 mb-2 uppercase tracking-widest">Danger Zone</h4>
                                <p className="text-xs text-slate-500 mb-4">Actions in this area are irreversible and affect all data.</p>
                                <button className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center gap-2 mx-auto sm:mx-0">
                                    <XCircle size={18} />
                                    Restore Factory Settings
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'database' && (
                        <div className="text-center py-20 px-4">
                            <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mx-auto mb-6">
                                <Database size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Database Management</h3>
                            <p className="text-slate-500 max-w-md mx-auto mb-8">
                                Connect to external storage, perform bulk exports, or clean up orphaned data records.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg">
                                    <Search size={18} />
                                    Run System Audit
                                </button>
                                <button
                                    onClick={clearData}
                                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg"
                                >
                                    <Trash2 size={18} />
                                    Wipe All Data
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Employee Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Edit2 size={20} className="text-indigo-600" />
                                Edit Employee
                            </h3>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Employee ID</label>
                                <input
                                    type="text"
                                    value={editForm.empId}
                                    onChange={(e) => setEditForm({ ...editForm, empId: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Designation</label>
                                <input
                                    type="text"
                                    value={editForm.designation}
                                    onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                                <Trash2 size={20} />
                                Delete Employee
                            </h3>
                            <button onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Are you sure you want to delete <strong>{selectedEmployee?.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Points Modal */}
            {showResetPointsModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-amber-600 flex items-center gap-2">
                                <RotateCcw size={20} />
                                Reset Points
                            </h3>
                            <button onClick={() => setShowResetPointsModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-slate-600 mb-2">
                            Reset points for <strong>{selectedEmployee?.name}</strong>?
                        </p>
                        <p className="text-sm text-slate-500 mb-6">
                            Current points: <strong>{selectedEmployee?.points || 0}</strong> → Will be set to <strong>0</strong>
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowResetPointsModal(false)}
                                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResetPointsConfirm}
                                className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all"
                            >
                                Reset to 0
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;

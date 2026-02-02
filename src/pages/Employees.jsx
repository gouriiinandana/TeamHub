import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import ExcelImport from '../components/ExcelImport';
import { Search, FileUp, Plus, Trash2, Trophy, MoreHorizontal, X, Edit2, Edit3, Users, Star } from 'lucide-react';

const Employees = () => {
    const { currentUser } = useAuth();
    const { employees, teams, addEmployee, updateEmployee, deleteEmployee, setEmployeePoints } = useData();
    const isAdmin = currentUser?.role === 'Admin';

    // Find if the logged-in user is in the employee list
    const myEmployeeRecord = employees.find(emp => emp.email === currentUser?.email);

    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', empId: '', designation: '', email: '' });
    const [actionMenuOpen, setActionMenuOpen] = useState(null);
    const [editingPointsEmpId, setEditingPointsEmpId] = useState(null);
    const [pointsInput, setPointsInput] = useState('');
    const [showTeamMembersFor, setShowTeamMembersFor] = useState(null);

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.empId.toString().includes(searchTerm)
    );

    const getTeamInfo = (teamId) => {
        const team = teams.find(t => t.id === teamId);
        if (!team) return { name: 'No Team', members: [] };

        const members = employees.filter(e => e.teamId === teamId);
        return { name: team.name, members };
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (isEditMode) {
            updateEmployee(editingId, formData);
        } else {
            addEmployee(formData);
        }
        setIsFormOpen(false);
        setIsEditMode(false);
        setEditingId(null);
        setFormData({ name: '', empId: '', designation: '', email: '' });
    };

    const handleEdit = (emp) => {
        setFormData({
            name: emp.name,
            empId: emp.empId,
            designation: emp.designation,
            email: emp.email || ''
        });
        setEditingId(emp.id);
        setIsEditMode(true);
        setIsFormOpen(true);
        setActionMenuOpen(null);
    };

    const handleDelete = (empId) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            deleteEmployee(empId);
        }
        setActionMenuOpen(null);
    };

    const handleEditPoints = (empId, currentPoints) => {
        setEditingPointsEmpId(empId);
        setPointsInput(currentPoints.toString());
        setActionMenuOpen(null);
    };

    const handleSavePoints = (empId) => {
        const newPoints = parseInt(pointsInput);
        if (!isNaN(newPoints) && newPoints >= 0) {
            setEmployeePoints(empId, newPoints);
        }
        setEditingPointsEmpId(null);
        setPointsInput('');
    };


    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">Employee Directory</h1>
                    <p className="text-slate-500 text-sm md:text-base">
                        {isAdmin ? 'Manage all company employees and their performance points.' : 'View your colleagues and team assignments.'}
                    </p>
                </div>
                {isAdmin && (
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            className="flex-1 md:flex-none justify-center px-4 py-2 bg-white border border-indigo-100 text-indigo-600 font-medium rounded-xl shadow-sm hover:bg-indigo-50 flex items-center gap-2 transition-all whitespace-nowrap"
                            onClick={() => document.getElementById('excel-drop').scrollIntoView({ behavior: 'smooth' })}
                        >
                            <FileUp size={18} /> Import
                        </button>
                        <button
                            onClick={() => {
                                setIsEditMode(false);
                                setFormData({ name: '', empId: '', designation: '', email: '' });
                                setIsFormOpen(true);
                            }}
                            className="flex-1 md:flex-none justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-xl shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 transition-all whitespace-nowrap"
                        >
                            <Plus size={18} /> Add
                        </button>
                    </div>
                )}
            </div>

            {/* My Team Spotlight for Members */}
            {!isAdmin && myEmployeeRecord && myEmployeeRecord.teamId && (
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-6 text-white shadow-xl animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner border border-white/30">
                                <Star size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Your Team: {teams.find(t => t.id === myEmployeeRecord.teamId)?.name}</h3>
                                <p className="text-indigo-100 opacity-90">You are collaborating with {employees.filter(e => e.teamId === myEmployeeRecord.teamId).length - 1} other team members.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSearchTerm(teams.find(t => t.id === myEmployeeRecord.teamId)?.name || '')}
                            className="px-6 py-2.5 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
                        >
                            View All Teammates
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Card */}
            <div className="glass-panel bg-white/80 rounded-3xl shadow-sm border border-white/50 overflow-hidden backdrop-blur-md">
                <div className="p-4 md:p-6 border-b border-indigo-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-indigo-50/30 to-purple-50/30">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">
                            {isAdmin ? 'Employee Management' : 'Our Workforce'}
                        </h3>
                        <p className="text-slate-500 text-sm">
                            {isAdmin ? 'View and manage all employees.' : 'Explore the company directory.'}
                        </p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-medium text-sm bg-white/50"
                        />
                    </div>
                </div>

                {/* Table Container - Responsive Scroll */}
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-indigo-50/50 text-indigo-400 text-xs uppercase tracking-wider font-semibold">
                                <th className="p-4 md:p-6 py-4">Employee ID</th>
                                <th className="p-4 md:p-6 py-4">Name</th>
                                <th className="p-4 md:p-6 py-4">Designation</th>
                                <th className="p-4 md:p-6 py-4">Team</th>
                                <th className="p-4 md:p-6 py-4 text-right">Points</th>
                                {isAdmin && <th className="p-4 md:p-6 py-4 text-center">Action</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-indigo-50">
                            {filteredEmployees.map(emp => {
                                const teamInfo = getTeamInfo(emp.teamId);
                                return (
                                    <tr key={emp.id} className="group hover:bg-white/60 transition-colors">
                                        <td className="p-4 md:p-6 py-4 font-mono text-slate-500 text-sm">{emp.empId}</td>
                                        <td className="p-4 md:p-6 py-4 font-bold text-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center text-indigo-600 text-xs shadow-sm shrink-0">
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span>{emp.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-normal">{emp.email || `${emp.name.toLowerCase().replace(' ', '')}@company.com`}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 md:p-6 py-4 text-slate-600 text-sm whitespace-nowrap">{emp.designation}</td>
                                        <td className="p-4 md:p-6 py-4 relative">
                                            {emp.teamId ? (
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowTeamMembersFor(showTeamMembersFor === emp.id ? null : emp.id)}
                                                        className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1 border border-indigo-100"
                                                    >
                                                        <Users size={12} /> {teamInfo.name}
                                                    </button>

                                                    {showTeamMembersFor === emp.id && (
                                                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 p-3 animate-fade-in">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Team Members</p>
                                                            <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                                                                {teamInfo.members.map(m => (
                                                                    <div key={m.id} className={`flex items-center gap-2 p-1.5 rounded-lg text-xs ${m.id === emp.id ? 'bg-indigo-50 font-bold text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                                                                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px]">
                                                                            {m.name.charAt(0)}
                                                                        </div>
                                                                        <span className="truncate">{m.name}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="p-4 md:p-6 py-4 text-right">
                                            {isAdmin && editingPointsEmpId === emp.id ? (
                                                <div className="inline-flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        value={pointsInput}
                                                        onChange={(e) => setPointsInput(e.target.value)}
                                                        className="w-20 px-2 py-1 border border-amber-300 rounded-lg text-sm font-bold text-center focus:ring-2 focus:ring-amber-400 outline-none"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleSavePoints(emp.id);
                                                            if (e.key === 'Escape') setEditingPointsEmpId(null);
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => handleSavePoints(emp.id)}
                                                        className="px-2 py-1 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingPointsEmpId(null)}
                                                        className="px-2 py-1 bg-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-400"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className={`inline-flex items-center gap-2 font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full text-sm border border-amber-100 whitespace-nowrap ${isAdmin ? 'group/points cursor-pointer' : ''}`}
                                                    onClick={() => isAdmin && handleEditPoints(emp.id, emp.points)}
                                                >
                                                    <Trophy size={14} /> {emp.points}
                                                    {isAdmin && <Edit3 size={12} className="opacity-0 group-hover/points:opacity-100 transition-opacity text-amber-600" />}
                                                </div>
                                            )}
                                        </td>
                                        {isAdmin && (
                                            <td className="p-4 md:p-6 py-4 text-center relative">
                                                <button
                                                    onClick={() => setActionMenuOpen(actionMenuOpen === emp.id ? null : emp.id)}
                                                    className="text-slate-300 hover:text-indigo-500 transition-colors p-2 hover:bg-indigo-50 rounded-lg"
                                                >
                                                    <MoreHorizontal size={18} />
                                                </button>

                                                {/* Action Dropdown */}
                                                {actionMenuOpen === emp.id && (
                                                    <div className="absolute right-4 top-12 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 min-w-[160px] overflow-hidden">
                                                        <button
                                                            onClick={() => handleEdit(emp)}
                                                            className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-indigo-50 flex items-center gap-3 transition-colors"
                                                        >
                                                            <Edit2 size={16} className="text-indigo-500" />
                                                            Edit Details
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(emp.id)}
                                                            className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-slate-100"
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                            {filteredEmployees.length === 0 && (
                                <tr>
                                    <td colSpan={isAdmin ? 6 : 5} className="p-10 text-center text-slate-400 italic">
                                        No employees found matching the criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Import Section */}
            {isAdmin && (
                <div id="excel-drop" className="animate-fade-in-up">
                    <ExcelImport />
                </div>
            )}

            {/* Add/Edit Employee Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full animate-float border border-white/50 relative overflow-hidden">
                        <button onClick={() => {
                            setIsFormOpen(false);
                            setIsEditMode(false);
                            setFormData({ name: '', empId: '', designation: '', email: '' });
                        }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-20"><X size={20} /></button>
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-pink-500"></div>
                        <h3 className="text-2xl font-bold mb-6 text-slate-800 mt-2">
                            {isEditMode ? 'Edit Employee' : 'Add New Employee'}
                        </h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-500 ml-1">Full Name</label>
                                <input type="text" placeholder="e.g. John Doe" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-500 ml-1">Employee ID</label>
                                <input type="text" placeholder="e.g. EMP001" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                                    value={formData.empId} onChange={e => setFormData({ ...formData, empId: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-500 ml-1">Designation</label>
                                <input type="text" placeholder="e.g. Designer" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                                    value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-500 ml-1">Email</label>
                                <input type="email" placeholder="e.g. john.doe@company.com" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => {
                                    setIsFormOpen(false);
                                    setIsEditMode(false);
                                    setFormData({ name: '', empId: '', designation: '', email: '' });
                                }} className="flex-1 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all">
                                    {isEditMode ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;

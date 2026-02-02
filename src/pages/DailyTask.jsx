import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Moon, Star, Sun, CheckCircle2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DailyTask = () => {
    const { dailyTasks, saveOTT, saveMIT } = useData();

    // Date state
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const today = new Date().toISOString().split('T')[0];

    // OTT State
    const [ottTasks, setOttTasks] = useState(['', '', '']);
    const [ottSubmitted, setOttSubmitted] = useState(false);

    // MIT State
    const [selectedMIT, setSelectedMIT] = useState('');
    const [mitSubmitted, setMitSubmitted] = useState(false);

    // Load saved data for selected date
    useEffect(() => {
        // For OTT: Load tomorrow's OTT tasks (submitted today for tomorrow)
        const tomorrow = new Date(selectedDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const tomorrowData = dailyTasks[tomorrowStr];
        if (tomorrowData?.ott && tomorrowData.ott.length > 0) {
            setOttTasks(tomorrowData.ott);
            setOttSubmitted(true);
        } else {
            setOttTasks(['', '', '']);
            setOttSubmitted(false);
        }

        // For MIT: Load today's MIT (selected from yesterday's OTT)
        const dateData = dailyTasks[selectedDate];
        if (dateData?.mit) {
            setSelectedMIT(dateData.mit);
            setMitSubmitted(true);
        } else {
            setSelectedMIT('');
            setMitSubmitted(false);
        }
    }, [selectedDate, dailyTasks]);

    const handleOttChange = (index, value) => {
        const newTasks = [...ottTasks];
        newTasks[index] = value;
        setOttTasks(newTasks);
    };

    // Check if current time is before 8 PM
    const isOttTimeValid = () => {
        const now = new Date();
        const currentHour = now.getHours();
        return currentHour < 20; // Before 8 PM (20:00)
    };

    // Check if current time is between 6 AM and 10 PM
    const isMitTimeValid = () => {
        const now = new Date();
        const currentHour = now.getHours();
        return currentHour >= 6 && currentHour < 22; // Between 6 AM and 10 PM
    };

    const handleOttSubmit = (e) => {
        e.preventDefault();

        // Check if it's today
        if (!isToday) {
            alert('You can only submit OTT tasks for today!');
            return;
        }

        // Check time restriction
        if (!isOttTimeValid()) {
            alert('⏰ OTT Submission Deadline Passed!\n\nOTT tasks can only be submitted before 8:00 PM.\n\nPlease try again tomorrow before the deadline.');
            return;
        }

        const filledTasks = ottTasks.filter(task => task.trim() !== '');
        if (filledTasks.length === 0) {
            alert('Please add at least one task!');
            return;
        }

        // Save OTT for TOMORROW
        const tomorrow = new Date(selectedDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        saveOTT(tomorrowStr, ottTasks);
        setOttSubmitted(true);
    };

    const handleMitSubmit = (e) => {
        e.preventDefault();

        // Check if it's today
        if (!isToday) {
            alert('You can only submit MIT for today!');
            return;
        }

        // Check time restriction
        if (!isMitTimeValid()) {
            const now = new Date();
            const currentHour = now.getHours();
            if (currentHour < 6) {
                alert('⏰ Too Early!\n\nMIT can only be submitted between 6:00 AM and 10:00 PM.\n\nPlease wait until 6:00 AM to submit your MIT.');
            } else {
                alert('⏰ MIT Submission Window Closed!\n\nMIT can only be submitted between 6:00 AM and 10:00 PM.\n\nThe submission window has closed for today. Please try again tomorrow.');
            }
            return;
        }

        if (!selectedMIT) {
            alert('Please select a task!');
            return;
        }

        // Save MIT for TODAY (from yesterday's OTT)
        saveMIT(selectedDate, selectedMIT);
        setMitSubmitted(true);
    };

    const handleEditOtt = () => {
        setOttSubmitted(false);
    };

    const handleEditMit = () => {
        setMitSubmitted(false);
    };

    const changeDate = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate.toISOString().split('T')[0]);
    };

    const goToToday = () => {
        setSelectedDate(today);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const isToday = selectedDate === today;
    const filledOttTasks = ottTasks.filter(task => task.trim() !== '');

    // Get yesterday's OTT tasks for MIT selection
    const getYesterdayOttTasks = () => {
        const yesterday = new Date(selectedDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const yesterdayData = dailyTasks[yesterdayStr];
        return yesterdayData?.ott?.filter(task => task.trim() !== '') || [];
    };

    const yesterdayOttTasks = getYesterdayOttTasks();

    return (
        <div className="space-y-8 pb-8">
            {/* Header with Date Navigation */}
            <div className="pb-6 border-b border-indigo-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight flex items-center gap-3">
                            <Calendar size={36} className="text-indigo-600" />
                            Daily Task Planner
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm md:text-base">Organize your day and prioritize what matters most</p>
                    </div>

                    {/* Date Picker */}
                    <div className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-md border border-indigo-100">
                        <button
                            onClick={() => changeDate(-1)}
                            className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Previous day"
                        >
                            <ChevronLeft size={20} className="text-indigo-600" />
                        </button>

                        <div className="flex flex-col items-center px-4">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="text-sm font-semibold text-slate-800 border-none outline-none cursor-pointer"
                            />
                            <span className="text-xs text-slate-500">{formatDate(selectedDate)}</span>
                        </div>

                        <button
                            onClick={() => changeDate(1)}
                            className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Next day"
                        >
                            <ChevronRight size={20} className="text-indigo-600" />
                        </button>

                        {!isToday && (
                            <button
                                onClick={goToToday}
                                className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                Today
                            </button>
                        )}
                    </div>
                </div>

                {!isToday && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-800 font-medium">
                            📅 Viewing historical data for {formatDate(selectedDate)}
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* OTT Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 md:p-8 border border-indigo-100 shadow-lg">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <Moon size={24} className="text-indigo-600" />
                            OTT - Organize Today Tomorrow
                        </h2>
                        <div className="flex items-center gap-2 text-sm">
                            <Star size={16} className="text-amber-500" />
                            <span className="font-medium text-slate-600">Fill before 8:00 PM</span>
                            {isToday && (
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${isOttTimeValid()
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}>
                                    {isOttTimeValid() ? '✓ Open' : '✗ Closed'}
                                </span>
                            )}
                        </div>
                    </div>

                    {ottSubmitted ? (
                        <div className="space-y-4">
                            <div className="bg-white/70 rounded-2xl p-6 border border-indigo-200">
                                <div className="flex items-center gap-2 mb-4 text-green-600">
                                    <CheckCircle2 size={20} />
                                    <span className="font-semibold">Tasks Submitted!</span>
                                </div>
                                <ul className="space-y-3">
                                    {filledOttTasks.map((task, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                                                {index + 1}
                                            </div>
                                            <span className="text-slate-700">{task}</span>
                                        </li>
                                    ))}
                                </ul>
                                {isToday && (
                                    <button
                                        onClick={handleEditOtt}
                                        className="mt-4 w-full py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl font-semibold transition-colors"
                                    >
                                        Edit Tasks
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            {!isToday ? (
                                <div className="bg-white/70 rounded-2xl p-6 border border-indigo-200 text-center">
                                    <Calendar size={48} className="mx-auto mb-3 text-slate-300" />
                                    <p className="text-slate-500 font-medium">No tasks for this date</p>
                                </div>
                            ) : (
                                <form onSubmit={handleOttSubmit} className="space-y-4">
                                    {ottTasks.map((task, index) => (
                                        <div key={index} className="relative">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Task {index + 1}
                                            </label>
                                            <input
                                                type="text"
                                                value={task}
                                                onChange={(e) => handleOttChange(index, e.target.value)}
                                                placeholder={`Enter task ${index + 1}...`}
                                                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none bg-white/70 backdrop-blur-sm"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all"
                                    >
                                        Submit OTT Tasks
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>

                {/* MIT Section */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 md:p-8 border border-amber-100 shadow-lg">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <Sun size={24} className="text-amber-600" />
                            MIT - Most Important Task
                        </h2>
                        <div className="flex items-center gap-2 text-sm">
                            <Sun size={16} className="text-amber-500" />
                            <span className="font-medium text-slate-600">Fill between 6:00 AM - 10:00 PM</span>
                            {isToday && (
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${isMitTimeValid()
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}>
                                    {isMitTimeValid() ? '✓ Open' : '✗ Closed'}
                                </span>
                            )}
                        </div>
                    </div>

                    {yesterdayOttTasks.length === 0 ? (
                        <div className="bg-white/70 rounded-2xl p-6 border border-amber-200 text-center">
                            <Moon size={48} className="mx-auto mb-3 text-slate-300" />
                            <p className="text-slate-500 font-medium">
                                {!isToday ? 'No OTT tasks from previous day' : 'No OTT tasks from yesterday'}
                            </p>
                            {isToday && (
                                <p className="text-sm text-slate-400 mt-2">
                                    You need to submit OTT tasks today (before 8 PM) to select MIT tomorrow
                                </p>
                            )}
                        </div>
                    ) : mitSubmitted ? (
                        <div className="space-y-4">
                            <div className="bg-white/70 rounded-2xl p-6 border border-amber-200">
                                <div className="flex items-center gap-2 mb-4 text-green-600">
                                    <CheckCircle2 size={20} />
                                    <span className="font-semibold">MIT Selected!</span>
                                </div>
                                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 border border-amber-300">
                                    <p className="text-sm text-amber-700 font-semibold mb-2">Your Most Important Task:</p>
                                    <p className="text-slate-800 font-bold text-lg">{selectedMIT}</p>
                                </div>
                                {isToday && (
                                    <button
                                        onClick={handleEditMit}
                                        className="mt-4 w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl font-semibold transition-colors"
                                    >
                                        Change MIT
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            {!isToday ? (
                                <div className="bg-white/70 rounded-2xl p-6 border border-amber-200 text-center">
                                    <Sun size={48} className="mx-auto mb-3 text-slate-300" />
                                    <p className="text-slate-500 font-medium">No MIT selected for this date</p>
                                </div>
                            ) : (
                                <form onSubmit={handleMitSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                                            Select your most important task from yesterday's OTT:
                                        </label>
                                        <div className="space-y-3">
                                            {yesterdayOttTasks.map((task, index) => (
                                                <label
                                                    key={index}
                                                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedMIT === task
                                                        ? 'border-amber-500 bg-amber-50'
                                                        : 'border-amber-200 bg-white/70 hover:border-amber-300'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="mit"
                                                        value={task}
                                                        checked={selectedMIT === task}
                                                        onChange={(e) => setSelectedMIT(e.target.value)}
                                                        className="mt-1 w-4 h-4 text-amber-600 focus:ring-amber-500"
                                                    />
                                                    <span className="text-slate-700 flex-1">{task}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-amber-500/30 transform hover:-translate-y-1 transition-all"
                                    >
                                        Submit MIT
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyTask;

import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // Load initial state from localStorage or default to empty
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('teamhub_employees');
    return saved ? JSON.parse(saved) : [];
  });

  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('teamhub_teams');
    return saved ? JSON.parse(saved) : [];
  });

  const [games, setGames] = useState(() => {
    const saved = localStorage.getItem('teamhub_games');
    return saved ? JSON.parse(saved) : [];
  });

  const [scheduledGames, setScheduledGames] = useState(() => {
    const saved = localStorage.getItem('teamhub_scheduled_games');
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyTasks, setDailyTasks] = useState(() => {
    const saved = localStorage.getItem('teamhub_daily_tasks');
    return saved ? JSON.parse(saved) : {};
  });

  const [workforceTeams, setWorkforceTeams] = useState(() => {
    const saved = localStorage.getItem('teamhub_workforce_teams');
    return saved ? JSON.parse(saved) : [];
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('teamhub_announcements');
    return saved ? JSON.parse(saved) : [];
  });

  const [systemSettings, setSystemSettings] = useState(() => {
    const saved = localStorage.getItem('teamhub_system_settings');
    return saved ? JSON.parse(saved) : { appName: 'TeamHub', logo: null, primaryColor: 'indigo' };
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('teamhub_activities');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('teamhub_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('teamhub_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('teamhub_games', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('teamhub_scheduled_games', JSON.stringify(scheduledGames));
  }, [scheduledGames]);

  useEffect(() => {
    localStorage.setItem('teamhub_workforce_teams', JSON.stringify(workforceTeams));
  }, [workforceTeams]);

  useEffect(() => {
    localStorage.setItem('teamhub_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('teamhub_daily_tasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  useEffect(() => {
    localStorage.setItem('teamhub_system_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem('teamhub_activities', JSON.stringify(activities));
  }, [activities]);

  // --- Actions ---

  const addEmployee = (employee) => {
    // employee: { name, empId, designation, email }
    setEmployees((prev) => [...prev, {
      ...employee,
      id: Date.now().toString(),
      points: 0,
      role: employee.role || 'Member',
      status: 'Active',
      teamId: null
    }]);
    logActivity({
      type: 'user',
      user: 'Admin',
      action: `Added employee ${employee.name}`
    });
  };

  const importEmployees = (newEmployees) => {
    // Expecting array of { name, empId, designation, email }
    const formatted = newEmployees.map((emp, idx) => ({
      ...emp,
      id: `${Date.now()}-${idx}`,
      teamId: null,
      role: 'Member',
      status: 'Active',
      points: 0,
      email: emp.email || '' // Preserve email if provided
    }));
    setEmployees((prev) => [...prev, ...formatted]);
    logActivity({
      type: 'system',
      user: 'Admin',
      action: `Imported ${newEmployees.length} employees`
    });
    setEmployees((prev) => [...prev, ...formatted]);
  };

  const createTeam = (teamName) => {
    const newTeam = {
      id: Date.now().toString(),
      name: teamName,
      points: 0,
      members: [] // We can store member IDs here or just filter employees by teamId
    };
    setTeams((prev) => [...prev, newTeam]);
  };

  const assignTeam = (employeeId, teamId, role = 'Member') => {
    setEmployees((prev) => prev.map(emp =>
      emp.id === employeeId ? { ...emp, teamId, role } : emp
    ));

    // Also update team member list if we cache it there, but deriving from employees is safer.
    // However, for performance or ease, let's just rely on filtering employees by teamId in the UI,
    // OR update the team object to keep a record.
    // Let's stick to a relational approach: Employee has teamId. 
    // Teams don't strictly need a members array if we filter, but it might be useful for caching.
    // Let's keep it simple: Source of truth is Employee.teamId.
  };

  const removeFromTeam = (employeeId) => {
    setEmployees((prev) => prev.map(emp =>
      emp.id === employeeId ? { ...emp, teamId: null, role: 'Member' } : emp
    ));
  };

  const addGame = (game) => {
    // game: { id, name, date, scores: [{ teamId, points }, { empId, points }] }
    setGames((prev) => [...prev, { ...game, id: Date.now().toString() }]);

    // Update points based on game results
    // This is complex: "points for each team and individual employee"

    if (game.teamScores) {
      // [{ teamId, points }]
      setTeams(prev => prev.map(team => {
        const score = game.teamScores.find(s => s.teamId === team.id);
        return score ? { ...team, points: team.points + score.points } : team;
      }));
    }

    if (game.employeeScores) {
      // [{ empId, points }]
      setEmployees(prev => prev.map(emp => {
        const score = game.employeeScores.find(s => s.empId === emp.id);
        return score ? { ...emp, points: emp.points + score.points } : emp;
      }));
    }
  };

  const updateTeamPoints = (teamId, pointsToAdd) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, points: t.points + pointsToAdd } : t));
  };

  const updateEmployeePoints = (empId, pointsToAdd) => {
    setEmployees(prev => prev.map(e => e.id === empId ? { ...e, points: e.points + pointsToAdd } : e));
  };

  const setTeamPoints = (teamId, newPoints) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, points: newPoints } : t));
  };

  const setEmployeePoints = (empId, newPoints) => {
    setEmployees(prev => prev.map(e => e.id === empId ? { ...e, points: newPoints } : e));
  };

  const updateEmployee = (empId, updatedData) => {
    setEmployees(prev => prev.map(e =>
      e.id === empId ? { ...e, ...updatedData } : e
    ));
  };

  const deleteEmployee = (empId) => {
    setEmployees(prev => prev.filter(e => e.id !== empId));
  };

  // Scheduled Games Functions
  const scheduleGame = (gameData) => {
    const newGame = {
      ...gameData,
      id: Date.now().toString(),
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    setScheduledGames(prev => [...prev, newGame]);
  };

  const updateScheduledGame = (gameId, updatedData) => {
    setScheduledGames(prev => prev.map(g =>
      g.id === gameId ? { ...g, ...updatedData } : g
    ));
  };

  const deleteScheduledGame = (gameId) => {
    setScheduledGames(prev => prev.filter(g => g.id !== gameId));
  };

  // Daily Tasks Functions
  const saveOTT = (date, tasks) => {
    setDailyTasks(prev => ({
      ...prev,
      [date]: { ...prev[date], ott: tasks }
    }));
  };

  const saveMIT = (date, task) => {
    setDailyTasks(prev => ({
      ...prev,
      [date]: { ...prev[date], mit: task }
    }));
  };

  // Workforce Teams Functions
  const createWorkforceTeam = (teamData) => {
    const newTeam = {
      id: Date.now().toString(),
      ...teamData,
      members: teamData.members || [],
      createdAt: new Date().toISOString()
    };
    setWorkforceTeams(prev => [...prev, newTeam]);
    return newTeam;
  };

  const updateWorkforceTeam = (teamId, updates) => {
    setWorkforceTeams(prev => prev.map(team =>
      team.id === teamId ? { ...team, ...updates } : team
    ));
  };

  const deleteWorkforceTeam = (teamId) => {
    setWorkforceTeams(prev => prev.filter(team => team.id !== teamId));
  };

  const addMemberToWorkforceTeam = (teamId, employeeId) => {
    setWorkforceTeams(prev => prev.map(team =>
      team.id === teamId
        ? { ...team, members: [...(team.members || []), employeeId] }
        : team
    ));
  };

  const removeMemberFromWorkforceTeam = (teamId, employeeId) => {
    setWorkforceTeams(prev => prev.map(team =>
      team.id === teamId
        ? { ...team, members: (team.members || []).filter(id => id !== employeeId) }
        : team
    ));
  };

  // Announcements Functions
  const addAnnouncement = (announcementData) => {
    const newAnnouncement = {
      id: Date.now().toString(),
      ...announcementData,
      createdAt: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    return newAnnouncement;
  };

  const updateAnnouncement = (id, updates) => {
    setAnnouncements(prev => prev.map(announcement =>
      announcement.id === id ? { ...announcement, ...updates } : announcement
    ));
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
  };

  const addReactionToAnnouncement = (announcementId, emoji, employeeId) => {
    setAnnouncements(prev => prev.map(announcement => {
      if (announcement.id === announcementId) {
        const reactions = announcement.reactions || {};
        const emojiReactions = reactions[emoji] || [];

        // Toggle reaction - if employee already reacted with this emoji, remove it
        const hasReacted = emojiReactions.includes(employeeId);
        const updatedEmojiReactions = hasReacted
          ? emojiReactions.filter(id => id !== employeeId)
          : [...emojiReactions, employeeId];

        // Remove emoji key if no reactions left
        const updatedReactions = { ...reactions, [emoji]: updatedEmojiReactions };
        if (updatedEmojiReactions.length === 0) {
          delete updatedReactions[emoji];
        }

        return { ...announcement, reactions: updatedReactions };
      }
      return announcement;
    }));
  };


  // Admin Functions
  const updateSystemSettings = (updates) => {
    setSystemSettings(prev => ({ ...prev, ...updates }));
    logActivity({
      type: 'settings',
      user: 'Admin',
      action: `Updated system settings`
    });
  };

  const logActivity = (activity) => {
    const newActivity = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...activity
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 100)); // Keep last 100
  };

  const updateUserRole = (userId, role) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === userId ? { ...emp, role } : emp
    ));
    const empName = employees.find(e => e.id === userId)?.name || 'Unknown';
    logActivity({
      type: 'user',
      user: 'Admin',
      action: `Updated ${empName}'s role to ${role}`
    });
  };

  const toggleUserStatus = (userId) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === userId ? { ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' } : emp
    ));
    const emp = employees.find(e => e.id === userId);
    logActivity({
      type: 'user',
      user: 'Admin',
      action: `${emp?.status === 'Active' ? 'Deactivated' : 'Activated'} ${emp?.name}`
    });
  };

  // Helper to clear data (for testing)
  const clearData = () => {
    setEmployees([]);
    setTeams([]);
    setGames([]);
    localStorage.clear();
  };

  return (
    <DataContext.Provider value={{
      employees,
      teams,
      games,
      scheduledGames,
      dailyTasks,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      importEmployees,
      createTeam,
      assignTeam,
      removeFromTeam,
      addGame,
      updateTeamPoints,
      updateEmployeePoints,
      setTeamPoints,
      setEmployeePoints,
      scheduleGame,
      updateScheduledGame,
      deleteScheduledGame,
      saveOTT,
      saveMIT,
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
      systemSettings,
      updateSystemSettings,
      activities,
      logActivity,
      updateUserRole,
      toggleUserStatus,
      clearData
    }}>
      {children}
    </DataContext.Provider>
  );
};

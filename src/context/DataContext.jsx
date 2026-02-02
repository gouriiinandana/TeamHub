import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
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

  // Persistent Storage Sync
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
    localStorage.setItem('teamhub_daily_tasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  useEffect(() => {
    localStorage.setItem('teamhub_workforce_teams', JSON.stringify(workforceTeams));
  }, [workforceTeams]);

  useEffect(() => {
    localStorage.setItem('teamhub_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('teamhub_system_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem('teamhub_activities', JSON.stringify(activities));
  }, [activities]);

  // --- Actions ---

  const addEmployee = (employee) => {
    const newEmployee = {
      ...employee,
      id: Date.now().toString(),
      points: 0,
      role: employee.role || 'Member',
      status: 'Active',
      teamId: null,
      createdAt: new Date().toISOString()
    };
    setEmployees(prev => [...prev, newEmployee]);
    logActivity({
      type: 'user',
      user: 'Admin',
      action: `Added employee ${employee.name}`
    });
  };

  const importEmployees = (newEmployees) => {
    const formatted = newEmployees.map(emp => ({
      ...emp,
      id: Math.random().toString(36).substr(2, 9),
      points: 0,
      role: 'Member',
      status: 'Active',
      teamId: null,
      email: emp.email || '',
      createdAt: new Date().toISOString()
    }));
    setEmployees(prev => [...prev, ...formatted]);
    logActivity({
      type: 'system',
      user: 'Admin',
      action: `Imported ${newEmployees.length} employees`
    });
  };

  const createTeam = (teamName) => {
    const newTeam = {
      id: Date.now().toString(),
      name: teamName,
      points: 0,
      members: [],
      createdAt: new Date().toISOString()
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const assignTeam = (employeeId, teamId, role = 'Member') => {
    setEmployees(prev => prev.map(emp =>
      emp.id === employeeId ? { ...emp, teamId, role } : emp
    ));
  };

  const removeFromTeam = (employeeId) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === employeeId ? { ...emp, teamId: null, role: 'Member' } : emp
    ));
  };

  const addGame = (game) => {
    const newGame = {
      ...game,
      id: Date.now().toString(),
      date: game.date || new Date().toISOString()
    };
    setGames(prev => [...prev, newGame]);

    // Update points locally
    if (game.teamScores) {
      game.teamScores.forEach(score => {
        updateTeamPoints(score.teamId, score.points);
      });
    }

    if (game.employeeScores) {
      game.employeeScores.forEach(score => {
        updateEmployeePoints(score.empId, score.points);
      });
    }
  };

  const updateTeamPoints = (teamId, pointsToAdd) => {
    setTeams(prev => prev.map(team =>
      team.id === teamId ? { ...team, points: (team.points || 0) + pointsToAdd } : team
    ));
  };

  const updateEmployeePoints = (empId, pointsToAdd) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === empId ? { ...emp, points: (emp.points || 0) + pointsToAdd } : emp
    ));
  };

  const setTeamPoints = (teamId, newPoints) => {
    setTeams(prev => prev.map(team =>
      team.id === teamId ? { ...team, points: newPoints } : team
    ));
  };

  const setEmployeePoints = (empId, newPoints) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === empId ? { ...emp, points: newPoints } : emp
    ));
  };

  const updateEmployee = (empId, updatedData) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === empId ? { ...emp, ...updatedData } : emp
    ));
  };

  const deleteEmployee = (empId) => {
    setEmployees(prev => prev.filter(emp => emp.id !== empId));
  };

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
    setScheduledGames(prev => prev.map(game =>
      game.id === gameId ? { ...game, ...updatedData } : game
    ));
  };

  const deleteScheduledGame = (gameId) => {
    setScheduledGames(prev => prev.filter(game => game.id !== gameId));
  };

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

  const createWorkforceTeam = (teamData) => {
    const newTeam = {
      ...teamData,
      id: Date.now().toString(),
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
      team.id === teamId ? { ...team, members: [...new Set([...team.members, employeeId])] } : team
    ));
  };

  const removeMemberFromWorkforceTeam = (teamId, employeeId) => {
    setWorkforceTeams(prev => prev.map(team =>
      team.id === teamId ? { ...team, members: team.members.filter(id => id !== employeeId) } : team
    ));
  };

  const addAnnouncement = (announcementData) => {
    const newAnnouncement = {
      ...announcementData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      reactions: {}
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    return newAnnouncement;
  };

  const updateAnnouncement = (id, updates) => {
    setAnnouncements(prev => prev.map(ann =>
      ann.id === id ? { ...ann, ...updates } : ann
    ));
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  };

  const addReactionToAnnouncement = (announcementId, emoji, employeeId) => {
    setAnnouncements(prev => prev.map(ann => {
      if (ann.id === announcementId) {
        const reactions = { ...ann.reactions };
        const emojiReactions = [...(reactions[emoji] || [])];

        const hasReacted = emojiReactions.includes(employeeId);
        const updatedEmojiReactions = hasReacted
          ? emojiReactions.filter(id => id !== employeeId)
          : [...emojiReactions, employeeId];

        if (updatedEmojiReactions.length === 0) {
          delete reactions[emoji];
        } else {
          reactions[emoji] = updatedEmojiReactions;
        }

        return { ...ann, reactions };
      }
      return ann;
    }));
  };

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
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 100));
  };

  const updateUserRole = (userId, role) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === userId ? { ...emp, role } : emp
    ));
    logActivity({
      type: 'user',
      user: 'Admin',
      action: `Updated role for user ID ${userId} to ${role}`
    });
  };

  const toggleUserStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setEmployees(prev => prev.map(emp =>
      emp.id === userId ? { ...emp, status: newStatus } : emp
    ));
    logActivity({
      type: 'user',
      user: 'Admin',
      action: `${newStatus === 'Active' ? 'Activated' : 'Deactivated'} user ID ${userId}`
    });
  };

  const clearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <DataContext.Provider value={{
      employees,
      teams,
      games,
      scheduledGames,
      dailyTasks,
      workforceTeams,
      announcements,
      systemSettings,
      activities,
      loading: false,
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
      createWorkforceTeam,
      updateWorkforceTeam,
      deleteWorkforceTeam,
      addMemberToWorkforceTeam,
      removeMemberFromWorkforceTeam,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      addReactionToAnnouncement,
      updateSystemSettings,
      logActivity,
      updateUserRole,
      toggleUserStatus,
      clearData
    }}>
      {children}
    </DataContext.Provider>
  );
};

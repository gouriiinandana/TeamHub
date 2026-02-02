import React, { createContext, useContext, useState, useEffect } from 'react';
import dataService from '../services/dataService';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [scheduledGames, setScheduledGames] = useState([]);
  const [workforceTeams, setWorkforceTeams] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [systemSettings, setSystemSettings] = useState({ appName: 'TeamHub', logo: null, primaryColor: 'indigo' });
  const [dailyTasks, setDailyTasks] = useState(() => {
    const saved = localStorage.getItem('teamhub_daily_tasks');
    return saved ? JSON.parse(saved) : {};
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist daily tasks to localStorage (not in backend yet)
  useEffect(() => {
    localStorage.setItem('teamhub_daily_tasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('teamhub_token');
      if (!token) return; // Don't fetch if not authenticated

      const [
        employeesData,
        teamsData,
        gamesData,
        scheduledGamesData,
        workforceTeamsData,
        announcementsData,
        activitiesData,
        settingsData
      ] = await Promise.all([
        dataService.getEmployees().catch(() => []),
        dataService.getTeams().catch(() => []),
        dataService.getGames().catch(() => []),
        dataService.getScheduledGames().catch(() => []),
        dataService.getWorkforceTeams().catch(() => []),
        dataService.getAnnouncements().catch(() => []),
        dataService.getActivities().catch(() => ({ activities: [] })),
        dataService.getSettings().catch(() => ({ appName: 'TeamHub', logo: null, primaryColor: 'indigo' }))
      ]);

      setEmployees(employeesData);
      setTeams(teamsData);
      setGames(gamesData);
      setScheduledGames(scheduledGamesData);
      setWorkforceTeams(workforceTeamsData);
      setAnnouncements(announcementsData);
      setActivities(activitiesData.activities || activitiesData);
      setSystemSettings(settingsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Employee Actions ---
  const addEmployee = async (employee) => {
    try {
      const newEmployee = await dataService.addEmployee(employee);
      setEmployees((prev) => [...prev, newEmployee]);
      await logActivity({
        type: 'user',
        user: 'Admin',
        action: `Added employee ${employee.name}`
      });
      return newEmployee;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add employee');
    }
  };

  const importEmployees = async (newEmployees) => {
    try {
      const result = await dataService.importEmployees(newEmployees);
      setEmployees((prev) => [...prev, ...result.employees]);
      await logActivity({
        type: 'system',
        user: 'Admin',
        action: `Imported ${result.employees.length} employees`
      });
      return result;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to import employees');
    }
  };

  const updateEmployee = async (empId, updatedData) => {
    try {
      const updated = await dataService.updateEmployee(empId, updatedData);
      setEmployees(prev => prev.map(e => e._id === empId ? updated : e));
      return updated;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update employee');
    }
  };

  const deleteEmployee = async (empId) => {
    try {
      await dataService.deleteEmployee(empId);
      setEmployees(prev => prev.filter(e => e._id !== empId));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const setEmployeePoints = async (empId, newPoints) => {
    try {
      const updated = await dataService.updateEmployeePoints(empId, newPoints);
      setEmployees(prev => prev.map(e => e._id === empId ? updated : e));
      return updated;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update employee points');
    }
  };

  const updateEmployeePoints = async (empId, pointsToAdd) => {
    const employee = employees.find(e => e._id === empId);
    if (employee) {
      return await setEmployeePoints(empId, employee.points + pointsToAdd);
    }
  };

  // --- Team Actions ---
  const createTeam = async (teamName) => {
    try {
      const newTeam = await dataService.createTeam(teamName);
      setTeams((prev) => [...prev, newTeam]);
      return newTeam;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create team');
    }
  };

  const assignTeam = async (employeeId, teamId, role = 'Member') => {
    try {
      await dataService.assignTeamMember(teamId, employeeId, role);
      // Refresh data
      const [updatedEmployees, updatedTeams] = await Promise.all([
        dataService.getEmployees(),
        dataService.getTeams()
      ]);
      setEmployees(updatedEmployees);
      setTeams(updatedTeams);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to assign team member');
    }
  };

  const removeFromTeam = async (employeeId) => {
    try {
      const employee = employees.find(e => e._id === employeeId);
      if (employee && employee.teamId) {
        await dataService.removeTeamMember(employee.teamId, employeeId);
        // Refresh data
        const [updatedEmployees, updatedTeams] = await Promise.all([
          dataService.getEmployees(),
          dataService.getTeams()
        ]);
        setEmployees(updatedEmployees);
        setTeams(updatedTeams);
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to remove team member');
    }
  };

  const setTeamPoints = async (teamId, newPoints) => {
    try {
      const updated = await dataService.updateTeamPoints(teamId, newPoints);
      setTeams(prev => prev.map(t => t._id === teamId ? updated : t));
      return updated;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update team points');
    }
  };

  const updateTeamPoints = async (teamId, pointsToAdd) => {
    const team = teams.find(t => t._id === teamId);
    if (team) {
      return await setTeamPoints(teamId, team.points + pointsToAdd);
    }
  };

  // --- Game Actions ---
  const addGame = async (game) => {
    try {
      const newGame = await dataService.addGame(game);
      setGames((prev) => [newGame, ...prev]);

      // Refresh employees and teams to get updated points
      const [updatedEmployees, updatedTeams] = await Promise.all([
        dataService.getEmployees(),
        dataService.getTeams()
      ]);
      setEmployees(updatedEmployees);
      setTeams(updatedTeams);

      return newGame;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add game');
    }
  };

  // --- Scheduled Games Actions ---
  const scheduleGame = async (gameData) => {
    try {
      const newGame = await dataService.scheduleGame(gameData);
      setScheduledGames(prev => [...prev, newGame]);
      return newGame;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to schedule game');
    }
  };

  const updateScheduledGame = async (gameId, updatedData) => {
    try {
      const updated = await dataService.updateScheduledGame(gameId, updatedData);
      setScheduledGames(prev => prev.map(g => g._id === gameId ? updated : g));
      return updated;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update scheduled game');
    }
  };

  const deleteScheduledGame = async (gameId) => {
    try {
      await dataService.deleteScheduledGame(gameId);
      setScheduledGames(prev => prev.filter(g => g._id !== gameId));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete scheduled game');
    }
  };

  // --- Daily Tasks (Local Storage Only) ---
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

  // --- Workforce Teams Actions ---
  const createWorkforceTeam = async (teamData) => {
    try {
      const newTeam = await dataService.createWorkforceTeam(teamData);
      setWorkforceTeams(prev => [...prev, newTeam]);
      return newTeam;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create workforce team');
    }
  };

  const updateWorkforceTeam = async (teamId, updates) => {
    try {
      const updated = await dataService.updateWorkforceTeam(teamId, updates);
      setWorkforceTeams(prev => prev.map(team => team._id === teamId ? updated : team));
      return updated;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update workforce team');
    }
  };

  const deleteWorkforceTeam = async (teamId) => {
    try {
      await dataService.deleteWorkforceTeam(teamId);
      setWorkforceTeams(prev => prev.filter(team => team._id !== teamId));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete workforce team');
    }
  };

  const addMemberToWorkforceTeam = async (teamId, employeeId) => {
    try {
      const updated = await dataService.addWorkforceTeamMember(teamId, employeeId);
      setWorkforceTeams(prev => prev.map(team => team._id === teamId ? updated : team));
      return updated;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add member to workforce team');
    }
  };

  const removeMemberFromWorkforceTeam = async (teamId, employeeId) => {
    try {
      const updated = await dataService.removeWorkforceTeamMember(teamId, employeeId);
      setWorkforceTeams(prev => prev.map(team => team._id === teamId ? updated : team));
      return updated;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to remove member from workforce team');
    }
  };

  // --- Announcements Actions ---
  const addAnnouncement = async (announcementData) => {
    try {
      const newAnnouncement = await dataService.addAnnouncement(announcementData);
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      return newAnnouncement;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add announcement');
    }
  };

  const updateAnnouncement = async (id, updates) => {
    try {
      const updated = await dataService.updateAnnouncement(id, updates);
      setAnnouncements(prev => prev.map(announcement => announcement._id === id ? updated : announcement));
      return updated;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update announcement');
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await dataService.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(announcement => announcement._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete announcement');
    }
  };

  // --- Admin Functions ---
  const updateSystemSettings = async (updates) => {
    try {
      const updated = await dataService.updateSettings(updates);
      setSystemSettings(updated);
      await logActivity({
        type: 'settings',
        user: 'Admin',
        action: 'Updated system settings'
      });
      return updated;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update settings');
    }
  };

  const logActivity = async (activity) => {
    try {
      const newActivity = await dataService.logActivity(activity);
      setActivities(prev => [newActivity, ...prev].slice(0, 100));
      return newActivity;
    } catch (err) {
      console.error('Failed to log activity:', err);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      const empName = employees.find(e => e._id === userId)?.name || 'Unknown';
      const updated = await updateEmployee(userId, { role });
      await logActivity({
        type: 'user',
        user: 'Admin',
        action: `Updated ${empName}'s role to ${role}`
      });
      return updated;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const emp = employees.find(e => e._id === userId);
      if (emp) {
        const newStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
        const updated = await updateEmployee(userId, { status: newStatus });
        await logActivity({
          type: 'user',
          user: 'Admin',
          action: `${newStatus === 'Active' ? 'Activated' : 'Deactivated'} ${emp.name}`
        });
        return updated;
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  // Helper to clear data (for testing)
  const clearData = () => {
    setEmployees([]);
    setTeams([]);
    setGames([]);
    setScheduledGames([]);
    setWorkforceTeams([]);
    setAnnouncements([]);
    setActivities([]);
    localStorage.clear();
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
      loading,
      error,
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
      updateSystemSettings,
      logActivity,
      updateUserRole,
      toggleUserStatus,
      clearData,
      refreshData: fetchAllData
    }}>
      {children}
    </DataContext.Provider>
  );
};

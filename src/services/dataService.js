import api from './api';

const dataService = {
    // ========== EMPLOYEES ==========
    getEmployees: async () => {
        const response = await api.get('/api/employees');
        return response.data;
    },

    addEmployee: async (employeeData) => {
        const response = await api.post('/api/employees', employeeData);
        return response.data;
    },

    updateEmployee: async (id, employeeData) => {
        const response = await api.put(`/api/employees/${id}`, employeeData);
        return response.data;
    },

    deleteEmployee: async (id) => {
        const response = await api.delete(`/api/employees/${id}`);
        return response.data;
    },

    updateEmployeePoints: async (id, points) => {
        const response = await api.patch(`/api/employees/${id}/points`, { points });
        return response.data;
    },

    importEmployees: async (employees) => {
        const response = await api.post('/api/employees/import', { employees });
        return response.data;
    },

    // ========== TEAMS ==========
    getTeams: async () => {
        const response = await api.get('/api/teams');
        return response.data;
    },

    createTeam: async (teamName) => {
        const response = await api.post('/api/teams', { name: teamName });
        return response.data;
    },

    updateTeam: async (id, teamData) => {
        const response = await api.put(`/api/teams/${id}`, teamData);
        return response.data;
    },

    deleteTeam: async (id) => {
        const response = await api.delete(`/api/teams/${id}`);
        return response.data;
    },

    updateTeamPoints: async (id, points) => {
        const response = await api.patch(`/api/teams/${id}/points`, { points });
        return response.data;
    },

    assignTeamMember: async (teamId, employeeId, role) => {
        const response = await api.post(`/api/teams/${teamId}/members`, { employeeId, role });
        return response.data;
    },

    removeTeamMember: async (teamId, employeeId) => {
        const response = await api.delete(`/api/teams/${teamId}/members/${employeeId}`);
        return response.data;
    },

    // ========== GAMES ==========
    getGames: async () => {
        const response = await api.get('/api/games');
        return response.data;
    },

    addGame: async (gameData) => {
        const response = await api.post('/api/games', gameData);
        return response.data;
    },

    getScheduledGames: async () => {
        const response = await api.get('/api/games/scheduled');
        return response.data;
    },

    scheduleGame: async (gameData) => {
        const response = await api.post('/api/games/scheduled', gameData);
        return response.data;
    },

    updateScheduledGame: async (id, gameData) => {
        const response = await api.put(`/api/games/scheduled/${id}`, gameData);
        return response.data;
    },

    deleteScheduledGame: async (id) => {
        const response = await api.delete(`/api/games/scheduled/${id}`);
        return response.data;
    },

    // ========== ANNOUNCEMENTS ==========
    getAnnouncements: async () => {
        const response = await api.get('/api/announcements');
        return response.data;
    },

    addAnnouncement: async (announcementData) => {
        const response = await api.post('/api/announcements', announcementData);
        return response.data;
    },

    updateAnnouncement: async (id, announcementData) => {
        const response = await api.put(`/api/announcements/${id}`, announcementData);
        return response.data;
    },

    deleteAnnouncement: async (id) => {
        const response = await api.delete(`/api/announcements/${id}`);
        return response.data;
    },

    // ========== WORKFORCE TEAMS ==========
    getWorkforceTeams: async () => {
        const response = await api.get('/api/workforce-teams');
        return response.data;
    },

    createWorkforceTeam: async (teamData) => {
        const response = await api.post('/api/workforce-teams', teamData);
        return response.data;
    },

    updateWorkforceTeam: async (id, teamData) => {
        const response = await api.put(`/api/workforce-teams/${id}`, teamData);
        return response.data;
    },

    deleteWorkforceTeam: async (id) => {
        const response = await api.delete(`/api/workforce-teams/${id}`);
        return response.data;
    },

    addWorkforceTeamMember: async (teamId, employeeId) => {
        const response = await api.post(`/api/workforce-teams/${teamId}/members`, { employeeId });
        return response.data;
    },

    removeWorkforceTeamMember: async (teamId, employeeId) => {
        const response = await api.delete(`/api/workforce-teams/${teamId}/members/${employeeId}`);
        return response.data;
    },

    // ========== ACTIVITIES ==========
    getActivities: async (page = 1, limit = 100) => {
        const response = await api.get(`/api/activities?page=${page}&limit=${limit}`);
        return response.data;
    },

    logActivity: async (activityData) => {
        const response = await api.post('/api/activities', activityData);
        return response.data;
    },

    // ========== SETTINGS ==========
    getSettings: async () => {
        const response = await api.get('/api/settings');
        return response.data;
    },

    updateSettings: async (settingsData) => {
        const response = await api.put('/api/settings', settingsData);
        return response.data;
    }
};

export default dataService;

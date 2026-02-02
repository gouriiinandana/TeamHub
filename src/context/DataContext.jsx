import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  setDoc,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [scheduledGames, setScheduledGames] = useState([]);
  const [dailyTasks, setDailyTasks] = useState({});
  const [workforceTeams, setWorkforceTeams] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [systemSettings, setSystemSettings] = useState({ appName: 'TeamHub', logo: null, primaryColor: 'indigo' });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Real-time Listeners ---

  useEffect(() => {
    // Employees Listener
    const unsubEmployees = onSnapshot(collection(db, 'employees'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(data);
    });

    // Teams Listener
    const unsubTeams = onSnapshot(collection(db, 'teams'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeams(data);
    });

    // Games Listener
    const unsubGames = onSnapshot(query(collection(db, 'games'), orderBy('createdAt', 'desc')), (snapshot) => { // Changed to createdAt for consistency
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGames(data);
    });

    // Scheduled Games Listener
    const unsubScheduled = onSnapshot(collection(db, 'scheduledGames'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setScheduledGames(data);
    });

    // Workforce Teams Listener
    const unsubWorkforce = onSnapshot(collection(db, 'workforceTeams'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorkforceTeams(data);
    });

    // Announcements Listener
    const unsubAnnouncements = onSnapshot(query(collection(db, 'announcements'), orderBy('createdAt', 'desc')), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(data);
    });

    // System Settings Listener
    const unsubSettings = onSnapshot(doc(db, 'settings', 'system'), (docSnap) => {
      if (docSnap.exists()) {
        setSystemSettings(docSnap.data());
      } else {
        // Initialize default settings if not found
        setDoc(doc(db, 'settings', 'system'), { appName: 'TeamHub', logo: null, primaryColor: 'indigo' }, { merge: true });
      }
    });

    // Activities Listener
    const unsubActivities = onSnapshot(query(collection(db, 'activities'), orderBy('timestamp', 'desc')), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivities(data.slice(0, 100));
    });

    // Daily Tasks Listener
    const unsubDailyTasks = onSnapshot(collection(db, 'dailyTasks'), (snapshot) => {
      const data = {};
      snapshot.docs.forEach(doc => {
        data[doc.id] = doc.data();
      });
      setDailyTasks(data);
      setLoading(false); // Set loading to false after all initial data is loaded
    });

    return () => {
      unsubEmployees();
      unsubTeams();
      unsubGames();
      unsubScheduled();
      unsubWorkforce();
      unsubAnnouncements();
      unsubSettings();
      unsubActivities();
      unsubDailyTasks();
    };
  }, []);

  // --- Actions ---

  const addEmployee = async (employee) => {
    const newEmployee = {
      ...employee,
      points: 0,
      role: employee.role || 'Member',
      status: 'Active',
      teamId: null,
      createdAt: serverTimestamp()
    };
    await addDoc(collection(db, 'employees'), newEmployee);
    logActivity({
      type: 'user',
      user: 'Admin',
      action: `Added employee ${employee.name}`
    });
  };

  const importEmployees = async (newEmployees) => {
    // In production, use a WriteBatch for this for better performance and atomicity
    for (const emp of newEmployees) {
      const formatted = {
        ...emp,
        points: 0,
        role: 'Member',
        status: 'Active',
        teamId: null,
        email: emp.email || '',
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'employees'), formatted);
    }
    logActivity({
      type: 'system',
      user: 'Admin',
      action: `Imported ${newEmployees.length} employees`
    });
  };

  const createTeam = async (teamName) => {
    const newTeam = {
      name: teamName,
      points: 0,
      members: [],
      createdAt: serverTimestamp()
    };
    await addDoc(collection(db, 'teams'), newTeam);
  };

  const assignTeam = async (employeeId, teamId, role = 'Member') => {
    const empRef = doc(db, 'employees', employeeId);
    await updateDoc(empRef, { teamId, role });
  };

  const removeFromTeam = async (employeeId) => {
    const empRef = doc(db, 'employees', employeeId);
    await updateDoc(empRef, { teamId: null, role: 'Member' });
  };

  const addGame = async (game) => {
    const gameData = {
      ...game,
      createdAt: serverTimestamp()
    };
    await addDoc(collection(db, 'games'), gameData);

    // Update points in Firestore
    if (game.teamScores) {
      for (const score of game.teamScores) {
        const teamRef = doc(db, 'teams', score.teamId);
        await updateDoc(teamRef, { points: increment(score.points) });
      }
    }

    if (game.employeeScores) {
      for (const score of game.employeeScores) {
        const empRef = doc(db, 'employees', score.empId);
        await updateDoc(empRef, { points: increment(score.points) });
      }
    }
  };

  const updateTeamPoints = async (teamId, pointsToAdd) => {
    const teamRef = doc(db, 'teams', teamId);
    await updateDoc(teamRef, { points: increment(pointsToAdd) });
  };

  const updateEmployeePoints = async (empId, pointsToAdd) => {
    const empRef = doc(db, 'employees', empId);
    await updateDoc(empRef, { points: increment(pointsToAdd) });
  };

  const setTeamPoints = async (teamId, newPoints) => {
    const teamRef = doc(db, 'teams', teamId);
    await updateDoc(teamRef, { points: newPoints });
  };

  const setEmployeePoints = async (empId, newPoints) => {
    const empRef = doc(db, 'employees', empId);
    await updateDoc(empRef, { points: newPoints });
  };

  const updateEmployee = async (empId, updatedData) => {
    const empRef = doc(db, 'employees', empId);
    await updateDoc(empRef, updatedData);
  };

  const deleteEmployee = async (empId) => {
    const empRef = doc(db, 'employees', empId);
    await deleteDoc(empRef);
  };

  const scheduleGame = async (gameData) => {
    const newGame = {
      ...gameData,
      status: 'scheduled',
      createdAt: serverTimestamp()
    };
    await addDoc(collection(db, 'scheduledGames'), newGame);
  };

  const updateScheduledGame = async (gameId, updatedData) => {
    const gameRef = doc(db, 'scheduledGames', gameId);
    await updateDoc(gameRef, updatedData);
  };

  const deleteScheduledGame = async (gameId) => {
    const gameRef = doc(db, 'scheduledGames', gameId);
    await deleteDoc(gameRef);
  };

  const saveOTT = async (date, tasks) => {
    const taskRef = doc(db, 'dailyTasks', date);
    await setDoc(taskRef, { ott: tasks }, { merge: true });
  };

  const saveMIT = async (date, task) => {
    const taskRef = doc(db, 'dailyTasks', date);
    await setDoc(taskRef, { mit: task }, { merge: true });
  };

  const createWorkforceTeam = async (teamData) => {
    const newTeam = {
      ...teamData,
      members: teamData.members || [],
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'workforceTeams'), newTeam);
    return { id: docRef.id, ...newTeam };
  };

  const updateWorkforceTeam = async (teamId, updates) => {
    const teamRef = doc(db, 'workforceTeams', teamId);
    await updateDoc(teamRef, updates);
  };

  const deleteWorkforceTeam = async (teamId) => {
    const teamRef = doc(db, 'workforceTeams', teamId);
    await deleteDoc(teamRef);
  };

  const addMemberToWorkforceTeam = async (teamId, employeeId) => {
    const teamRef = doc(db, 'workforceTeams', teamId);
    await updateDoc(teamRef, { members: arrayUnion(employeeId) });
  };

  const removeMemberFromWorkforceTeam = async (teamId, employeeId) => {
    const teamRef = doc(db, 'workforceTeams', teamId);
    await updateDoc(teamRef, { members: arrayRemove(employeeId) });
  };

  const addAnnouncement = async (announcementData) => {
    const newAnnouncement = {
      ...announcementData,
      createdAt: serverTimestamp(),
      reactions: {} // Initialize reactions as an empty object
    };
    const docRef = await addDoc(collection(db, 'announcements'), newAnnouncement);
    return { id: docRef.id, ...newAnnouncement };
  };

  const updateAnnouncement = async (id, updates) => {
    const announcementRef = doc(db, 'announcements', id);
    await updateDoc(announcementRef, updates);
  };

  const deleteAnnouncement = async (id) => {
    const announcementRef = doc(db, 'announcements', id);
    await deleteDoc(announcementRef);
  };

  const addReactionToAnnouncement = async (announcementId, emoji, employeeId) => {
    const announcementRef = doc(db, 'announcements', announcementId);
    const docSnap = await getDoc(announcementRef);

    if (docSnap.exists()) {
      const announcement = docSnap.data();
      const reactions = announcement.reactions || {};
      const emojiReactions = reactions[emoji] || [];

      const hasReacted = emojiReactions.includes(employeeId);
      const updatedEmojiReactions = hasReacted
        ? emojiReactions.filter(id => id !== employeeId)
        : [...emojiReactions, employeeId];

      const updatedReactions = { ...reactions, [emoji]: updatedEmojiReactions };
      if (updatedEmojiReactions.length === 0) {
        delete updatedReactions[emoji];
      }

      await updateDoc(announcementRef, { reactions: updatedReactions });
    }
  };

  const updateSystemSettings = async (updates) => {
    const settingsRef = doc(db, 'settings', 'system');
    await setDoc(settingsRef, updates, { merge: true });
    logActivity({
      type: 'settings',
      user: 'Admin',
      action: `Updated system settings`
    });
  };

  const logActivity = async (activity) => {
    const newActivity = {
      ...activity,
      timestamp: serverTimestamp()
    };
    await addDoc(collection(db, 'activities'), newActivity);
  };

  const updateUserRole = async (userId, role) => {
    const empRef = doc(db, 'employees', userId);
    await updateDoc(empRef, { role });
    // Note: Logging would ideally use the actual employee name, but we only have ID here.
    // In Firestore, we could fetch it first or just log the ID.
    logActivity({
      type: 'user',
      user: 'Admin',
      action: `Updated role for user ID ${userId} to ${role}`
    });
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const empRef = doc(db, 'employees', userId);
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    await updateDoc(empRef, { status: newStatus });
    logActivity({
      type: 'user',
      user: 'Admin',
      action: `${newStatus === 'Active' ? 'Activated' : 'Deactivated'} user ID ${userId}`
    });
  };

  const clearData = async () => {
    // This is dangerous in Firestore, usually not implemented this way for client-side.
    // For safety, let's just log it for now.
    console.warn('Clear data called. Firestore data must be manually cleared or deleted by collection via admin SDK or Firebase Console.');
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
      loading, // Expose loading state
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
      {!loading && children} {/* Render children only when data is loaded */}
    </DataContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(() => Cookies.get('userId') || null); // Initialize with function
  const [initialized, setInitialized] = useState(false);

  // Function to update userId
  const updateUserId = (newUserId) => {
    setUserId(newUserId);
    // Reset states when userId changes
    setStats(null);
    setError(null);
    setLoading(true);
  };

  const fetchStats = async () => {
    try {
      const currentUserId = Cookies.get('userId');
      if (!currentUserId) {
        setError('User ID not found');
        setStats(null);
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:5001/api/user/StatusNumber', { 
        userId: currentUserId 
      });
      
      if (response.data.success) {
        console.log('Stats fetched successfully:', response.data.data);
        setStats(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch stats');
        setStats(null);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
      setStats(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  // Initial setup effect
  useEffect(() => {
    const currentUserId = Cookies.get('userId');
    if (currentUserId !== userId) {
      setUserId(currentUserId);
    }
    setInitialized(true);
  }, []);

  // Fetch stats effect
  useEffect(() => {
    if (userId && initialized) {
      fetchStats();
    } else if (initialized) {
      setLoading(false);
      setStats(null);
    }
  }, [userId, initialized]);

  // Refresh stats manually
  const refreshStats = () => {
    if (userId) {
      setLoading(true);
      fetchStats();
    }
  };

  // Update stats after a post
  const updateStatsAfterPost = async (platforms) => {
    if (!userId) return;

    try {
      // Optimistic update
      setStats((prevStats) => {
        if (!prevStats) return prevStats;
        
        const newStats = { ...prevStats };
        platforms.forEach((platform) => {
          const platformKey = platform.toLowerCase();
          newStats[platformKey] = (newStats[platformKey] || 0) + 1;
        });
        return newStats;
      });

      // Fetch actual stats
      await fetchStats();
    } catch (error) {
      console.error('Error updating stats:', error);
      refreshStats();
    }
  };

  const value = {
    stats,
    loading,
    error,
    refreshStats,
    updateStatsAfterPost,
    updateUserId,
    initialized
  };

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Restore existing auth session on startup
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        // Fetch driver profile from backend or supabase
        try {
          const res = await apiClient.get('/auth/me');
          setUser(res.data.data);
        } catch (error) {
          // Token might be invalid/expired, supabase will handle refresh
          console.error('Error fetching user profile', error);
        }
      }
      setLoading(false);
    };

    initSession();

    // Listen for auth changes (like token refresh or logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session && !user) {
        try {
          const res = await apiClient.get('/auth/me');
          setUser(res.data.data);
        } catch (error) {
           console.error('Error fetching user profile on state change', error);
        }
      } else if (!session) {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const login = async (credentials) => {
    // We maintain MVC by calling our backend API
    const res = await apiClient.post('/auth/login', credentials);
    const { session, user: loggedInUser } = res.data.data;
    
    // Natively inject the session into the Supabase client so it manages persistence and refresh
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token
    });
    
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (data) => {
    const res = await apiClient.post('/auth/register', data);
    const { session, user: registeredUser } = res.data.data;
    
    if (session) {
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token
      });
    }
    
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    await apiClient.post('/auth/logout'); // Tell backend if necessary
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, logout, isAuthenticated: !!user, isDriver: user?.role === 'driver' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

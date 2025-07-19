'use client';

import { createContext, useContext, useEffect, useState } from 'react';

let supabase;
if (typeof window !== 'undefined') {
  const { supabase: supabaseClient } = require('@/utils/supabaseClient');
  supabase = supabaseClient;
}

const AdminAuthContext = createContext({});

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    
    // Get initial session and check if user is admin
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.role === 'admin') {
          setAdmin(session.user);
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.role === 'admin') {
          setAdmin(session.user);
        } else {
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (profile?.role !== 'admin') {
        await supabase.auth.signOut();
        return { data: null, error: { message: 'Unauthorized: Admin access required' } };
      }
    }
    
    return { data, error };
  };

  const signOut = async () => {
    if (!supabase) throw new Error('Supabase not initialized');
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    admin,
    loading,
    signIn,
    signOut
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
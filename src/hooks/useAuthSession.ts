
import { useState, useEffect } from 'react';
import { User } from '@/data/userRoles';
import { supabase } from '@/integrations/supabase/client';
import { useAuthAPI } from './useAuthAPI';

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { mapSupabaseUserToUser } = useAuthAPI();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setUser(null);
          setIsAuthenticated(false);
        } else if (data?.session) {
          // Ստանալ օգտատիրոջ տվյալները
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('User data error:', userError);
            setUser(null);
            setIsAuthenticated(false);
          } else if (userData.user) {
            // Ձևավորել User օբյեկտը auth.users-ից ստացված տվյալներով
            const authUser = mapSupabaseUserToUser(userData.user);
            
            setUser(authUser);
            setIsAuthenticated(true);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Ստուգել սեսիան սկզբից
    checkSession();

    // Սեսիաների փոփոխությունների հետևումը
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('User data error:', userError);
          setUser(null);
          setIsAuthenticated(false);
          return;
        }
        
        if (userData.user) {
          // Ստուգել արդյոք օգտատերը հաստատված է
          const isApproved = userData.user.user_metadata?.registration_approved || false;
          
          // Եթե հաստատված չէ և դերը ուսանողից բացի այլ է, ապա տեղեկացնել օգտատիրոջը
          if (!isApproved && userData.user.user_metadata?.role !== 'student') {
            await supabase.auth.signOut();
            setUser(null);
            setIsAuthenticated(false);
            return;
          }
          
          const authUser = mapSupabaseUserToUser(userData.user);
          
          setUser(authUser);
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      // ավտոմատ կանչվում է addEventListener-ի remove-ը
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, isAuthenticated, loading, setUser, setIsAuthenticated };
};

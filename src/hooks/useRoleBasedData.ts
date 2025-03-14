
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';

// Define table names as a union type with string literals for type safety
type ValidTable = 'users' | 'projects' | 'tasks' | 'notifications' | 
                 'project_assignments' | 'timeline_events' | 
                 'project_proposals' | 'employer_projects' | 'auth_logs';

type FilterOptions = {
  extraFilters?: Record<string, any>;
  limit?: number;
  orderBy?: { column: string; ascending?: boolean };
};

export function useRoleBasedData<T>(tableName: ValidTable, options?: FilterOptions) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Initialize query
      let query = supabase.from(tableName).select('*');
        
      // Apply role-based filtering
      if (user.role !== 'admin') {
        if (tableName === 'projects' || tableName === 'project_assignments' || tableName === 'tasks') {
          switch (user.role) {
            case 'student':
              query = query.eq('student_id', user.id);
              break;
            case 'supervisor':
            case 'project_manager':
              query = query.eq('supervisor_id', user.id);
              break;
            case 'lecturer':
            case 'instructor':
              query = query.eq('instructor_id', user.id);
              break;
            case 'employer':
              query = query.eq('created_by', user.id);
              break;
            default:
              query = query.eq('user_id', user.id);
          }
        } else if (tableName === 'project_proposals' || tableName === 'employer_projects') {
          if (user.role === 'employer') {
            query = query.eq('created_by', user.id);
          }
        }
      }
      
      // Apply extra filters if provided
      if (options?.extraFilters) {
        Object.entries(options.extraFilters).forEach(([key, value]) => {
          if (value !== undefined) {
            query = query.eq(key, value);
          }
        });
      }
      
      // Apply ordering if provided
      if (options?.orderBy) {
        const { column, ascending = true } = options.orderBy;
        query = query.order(column, { ascending });
      }
      
      // Apply limit if provided
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      // Execute the query
      const { data: responseData, error: responseError } = await query;
      
      if (responseError) {
        throw new Error(responseError.message);
      }
      
      setData(responseData as T[]);
    } catch (err) {
      console.error(`Error fetching ${tableName}:`, err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast.error(`Սխալ տվյալները բեռնելիս: ${err instanceof Error ? err.message : 'Անհայտ սխալ'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
      
      // Set up real-time subscription to changes
      const channel = supabase
        .channel(`${tableName}-changes`)
        .on('postgres_changes', {
          event: '*',  // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: tableName
        }, (payload) => {
          console.log(`Change in ${tableName}:`, payload);
          // Refresh data on any change
          fetchData();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [tableName, user, options?.extraFilters, options?.limit, options?.orderBy]);

  return { data, isLoading, error, refresh: fetchData };
}

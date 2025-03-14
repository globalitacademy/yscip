
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';

// Define allowed table names using a literal type to ensure type safety
type ValidTable = 'users' | 'projects' | 'tasks' | 'notifications' | 
                 'project_assignments' | 'timeline_events' | 
                 'project_proposals' | 'employer_projects' | 'auth_logs';

export const useRoleBasedData = <T>(tableName: ValidTable, options?: {
  extraFilters?: Record<string, any>,
  limit?: number,
  orderBy?: { column: string, ascending?: boolean }
}) => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize query
        const query = supabase
          .from(tableName)
          .select('*');
          
        // Apply role-based filtering based on role and table
        if (user.role !== 'admin') {
          if (tableName === 'projects' || tableName === 'project_assignments' || tableName === 'tasks') {
            switch (user.role) {
              case 'student':
                // Students can only see their assigned data
                query.eq('student_id', user.id);
                break;
              case 'supervisor':
              case 'project_manager':
                // Project managers and supervisors see projects they supervise
                query.eq('supervisor_id', user.id);
                break;
              case 'lecturer':
              case 'instructor':
                // Lecturers see courses they teach
                query.eq('instructor_id', user.id);
                break;
              case 'employer':
                // Employers see projects they created
                query.eq('created_by', user.id);
                break;
              default:
                // Default filter by user_id if applicable
                query.eq('user_id', user.id);
            }
          } else if (tableName === 'project_proposals' || tableName === 'employer_projects') {
            // Employer specific tables
            if (user.role === 'employer') {
              query.eq('created_by', user.id);
            }
          }
        }
        
        // Apply extra filters if provided
        if (options?.extraFilters) {
          Object.entries(options.extraFilters).forEach(([key, value]) => {
            if (value !== undefined) {
              query.eq(key, value);
            }
          });
        }
        
        // Apply ordering if provided
        if (options?.orderBy) {
          const { column, ascending = true } = options.orderBy;
          query.order(column, { ascending });
        }
        
        // Apply limit if provided
        if (options?.limit) {
          query.limit(options.limit);
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
  }, [tableName, user, options?.extraFilters, options?.limit, options?.orderBy]);

  return { data, isLoading, error, refresh: () => setIsLoading(true) };
};

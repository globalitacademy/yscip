
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useRoleBasedData = <T>(tableName: string, options?: {
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
        
        let query = supabase
          .from(tableName)
          .select('*');
          
        // Apply role-based filtering
        switch (user.role) {
          case 'admin':
            // Admins can see all data
            break;
          case 'student':
            // Students can only see their assigned data
            query = query.eq('student_id', user.id);
            break;
          case 'supervisor':
          case 'project_manager':
            // Project managers and supervisors see projects they supervise
            query = query.eq('supervisor_id', user.id);
            break;
          case 'lecturer':
          case 'instructor':
            // Lecturers see courses they teach
            query = query.eq('instructor_id', user.id);
            break;
          case 'employer':
            // Employers see projects they created
            query = query.eq('employer_id', user.id);
            break;
          default:
            // Default filter by user_id if applicable
            query = query.eq('user_id', user.id);
        }
        
        // Apply extra filters if provided
        if (options?.extraFilters) {
          Object.entries(options.extraFilters).forEach(([key, value]) => {
            query = query.eq(key, value);
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

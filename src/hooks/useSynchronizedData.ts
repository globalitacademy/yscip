
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Define allowed table names as a type to ensure type safety
type ValidTable = 'users' | 'projects' | 'tasks' | 'notifications' | 
                 'project_assignments' | 'timeline_events' | 
                 'project_proposals' | 'employer_projects' | 'auth_logs';

type FilterValue = {
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike';
  value: any;
};

type FetchOptions = {
  columns?: string;
  filter?: Record<string, any | FilterValue | any[]>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  page?: number;
};

export function useSynchronizedData<T>(
  tableName: ValidTable, 
  options: FetchOptions = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  
  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Build the query
      const columns = options.columns || '*';
      
      let query = supabase
        .from(tableName)
        .select(columns, { count: 'exact' });
      
      // Apply filters
      if (options.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              query = query.in(key, value);
            } else if (typeof value === 'object' && value !== null && 'operator' in value) {
              // Support for more complex filters
              const filterValue = value as FilterValue;
              switch (filterValue.operator) {
                case 'eq':
                  query = query.eq(key, filterValue.value);
                  break;
                case 'neq':
                  query = query.neq(key, filterValue.value);
                  break;
                case 'gt':
                  query = query.gt(key, filterValue.value);
                  break;
                case 'gte':
                  query = query.gte(key, filterValue.value);
                  break;
                case 'lt':
                  query = query.lt(key, filterValue.value);
                  break;
                case 'lte':
                  query = query.lte(key, filterValue.value);
                  break;
                case 'like':
                  query = query.like(key, `%${filterValue.value}%`);
                  break;
                case 'ilike':
                  query = query.ilike(key, `%${filterValue.value}%`);
                  break;
              }
            } else {
              query = query.eq(key, value);
            }
          }
        });
      }
      
      // Apply ordering
      if (options.orderBy) {
        const { column, ascending = true } = options.orderBy;
        query = query.order(column, { ascending });
      }
      
      // Apply pagination
      if (options.page && options.limit) {
        const from = (options.page - 1) * options.limit;
        const to = from + options.limit - 1;
        query = query.range(from, to);
      } else if (options.limit) {
        query = query.limit(options.limit);
      }
      
      // Execute the query
      const { data: responseData, error: responseError, count: responseCount } = await query;
      
      if (responseError) {
        throw new Error(responseError.message);
      }
      
      setData(responseData as T[]);
      if (responseCount !== null) {
        setCount(responseCount);
      }
    } catch (err) {
      console.error(`Error fetching ${tableName}:`, err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast.error(`Սխալ տվյալների համաժամացման ժամանակ։`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchData();
      
      // Set up real-time subscription
      const channel = supabase
        .channel(`${tableName}-changes`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: tableName 
        }, () => {
          fetchData();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [
    tableName, 
    user, 
    options.columns,
    JSON.stringify(options.filter),
    JSON.stringify(options.orderBy),
    options.limit,
    options.page
  ]);
  
  return { 
    data, 
    count, 
    loading, 
    error, 
    refresh: fetchData 
  };
}

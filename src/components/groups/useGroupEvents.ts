
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Group, GroupStudent } from './types';
import { toast } from 'sonner';

/**
 * A custom hook that subscribes to real-time group and group_students changes
 * and updates the state accordingly
 */
export const useGroupEvents = (
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>,
  setGroupStudents: React.Dispatch<React.SetStateAction<GroupStudent[]>>
) => {
  useEffect(() => {
    // Subscribe to groups changes
    const groupsSubscription = supabase
      .channel('groups-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'groups' },
        (payload) => {
          console.log('Groups real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newGroup = payload.new as Group;
            setGroups(prevGroups => {
              if (!prevGroups.some(g => g.id === newGroup.id)) {
                toast.success(`Նոր խումբ ստեղծվեց: ${newGroup.name}`);
                return [newGroup, ...prevGroups];
              }
              return prevGroups;
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedGroup = payload.new as Group;
            setGroups(prevGroups => 
              prevGroups.map(group => {
                if (group.id === updatedGroup.id) {
                  return updatedGroup;
                }
                return group;
              })
            );
            toast.success(`Խումբը թարմացվեց: ${updatedGroup.name}`);
          } else if (payload.eventType === 'DELETE') {
            const deletedGroup = payload.old as Group;
            setGroups(prevGroups => 
              prevGroups.filter(group => group.id !== deletedGroup.id)
            );
            toast.success(`Խումբը ջնջվեց: ${deletedGroup.name}`);
          }
        }
      )
      .subscribe();
    
    // Subscribe to group_students changes
    const groupStudentsSubscription = supabase
      .channel('group-students-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'group_students' },
        (payload) => {
          console.log('Group students real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newGroupStudent = payload.new as GroupStudent;
            setGroupStudents(prevGroupStudents => {
              if (!prevGroupStudents.some(gs => gs.id === newGroupStudent.id)) {
                toast.success(`Ուսանողն ավելացվեց խմբում`);
                return [newGroupStudent, ...prevGroupStudents];
              }
              return prevGroupStudents;
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedGroupStudent = payload.old as GroupStudent;
            setGroupStudents(prevGroupStudents => 
              prevGroupStudents.filter(gs => gs.id !== deletedGroupStudent.id)
            );
            toast.success(`Ուսանողը հեռացվեց խմբից`);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(groupsSubscription);
      supabase.removeChannel(groupStudentsSubscription);
    };
  }, [setGroups, setGroupStudents]);
};

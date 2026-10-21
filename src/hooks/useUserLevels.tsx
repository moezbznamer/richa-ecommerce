import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UserLevelInfo {
  total_spent: number;
  current_level: number;
  progress_percentage: number;
  next_milestone: number;
  badge_name: string;
}

// Create a context for sharing level refresh across components
let levelRefreshCallbacks: (() => void)[] = [];

export const triggerLevelRefresh = () => {
  levelRefreshCallbacks.forEach(callback => callback());
};

export const useUserLevels = () => {
  const [levelInfo, setLevelInfo] = useState<UserLevelInfo>({
    total_spent: 0,
    current_level: 1,
    progress_percentage: 0,
    next_milestone: 100,
    badge_name: 'None'
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchLevelInfo = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('user-levels', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error fetching level info:', error);
        toast.error('Erreur lors du chargement des informations de niveau');
        return;
      }

      setLevelInfo(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors du chargement des informations de niveau');
    } finally {
      setLoading(false);
    }
  };

  const simulateSpending = async (amount: number) => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const previousLevel = levelInfo.current_level;

      const { data, error } = await supabase.functions.invoke('user-levels', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { amount },
      });

      if (error) {
        console.error('Error simulating spending:', error);
        toast.error('Erreur lors de la simulation');
        return;
      }

      setLevelInfo(data);

      // Check if level up occurred
      if (data.current_level > previousLevel) {
        return true; // Level up occurred
      }
      
      return false;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la simulation');
      return false;
    }
  };

  useEffect(() => {
    fetchLevelInfo();
    
    // Register this component's refresh callback
    levelRefreshCallbacks.push(fetchLevelInfo);
    
    // Cleanup callback on unmount
    return () => {
      levelRefreshCallbacks = levelRefreshCallbacks.filter(cb => cb !== fetchLevelInfo);
    };
  }, [user]);

  return {
    levelInfo,
    loading,
    simulateSpending,
    refreshLevelInfo: fetchLevelInfo,
  };
};
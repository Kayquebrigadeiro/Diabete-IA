import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

export interface RoutineTask {
  schedule_id: string;
  medication_id: string;
  name: string;
  time: string | null;
  dosage: string;
  type: string;
  status: 'pending' | 'completed';
}

export function useDailyRoutine(childId: string) {
  const [tasks, setTasks] = useState<RoutineTask[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoutine = useCallback(async () => {
    if (!childId) return;
    setLoading(true);
    try {
      const { data } = await api.get<RoutineTask[]>('/dashboard/daily-routine', {
        params: { child_id: childId },
      });
      setTasks(data);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [childId]);

  const markAsTaken = async (task: RoutineTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.schedule_id === task.schedule_id ? { ...t, status: 'completed' } : t)),
    );
    try {
      await api.post('/logs', {
        child_id: childId,
        medication_id: task.medication_id,
        schedule_id: task.schedule_id,
        actual_dose: parseFloat(task.dosage) || 0,
        status: 'taken',
        taken_at: new Date().toISOString(),
      });
    } catch {
      fetchRoutine();
    }
  };

  useEffect(() => {
    fetchRoutine();
  }, [fetchRoutine]);

  return { tasks, loading, markAsTaken, refresh: fetchRoutine };
}

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { TaskAcceptStatus, TaskRecord } from '@/types/domain';

interface TasksContextValue {
  taskStatuses: Record<string, TaskAcceptStatus>;
  updateTaskStatus: (id: string, status: TaskAcceptStatus) => void;
  taskProviders: Record<string, string>;
  updateTaskProvider: (id: string, provider: string) => void;
  taskRefs: Record<string, string>;
  updateTaskRef: (id: string, ref: string) => void;
  customTasks: TaskRecord[];
  addTask: (task: TaskRecord) => void;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TaskAcceptStatus>>({});
  const [taskProviders, setTaskProviders] = useState<Record<string, string>>({});
  const [taskRefs, setTaskRefs] = useState<Record<string, string>>({});
  const [customTasks, setCustomTasks] = useState<TaskRecord[]>([]);

  function updateTaskStatus(id: string, status: TaskAcceptStatus) {
    setTaskStatuses((prev) => ({ ...prev, [id]: status }));
  }

  function updateTaskProvider(id: string, provider: string) {
    setTaskProviders((prev) => ({ ...prev, [id]: provider }));
  }

  function updateTaskRef(id: string, ref: string) {
    setTaskRefs((prev) => ({ ...prev, [id]: ref }));
  }

  function addTask(task: TaskRecord) {
    setCustomTasks((prev) => [task, ...prev]);
  }

  return (
    <TasksContext.Provider
      value={{
        taskStatuses,
        updateTaskStatus,
        taskProviders,
        updateTaskProvider,
        taskRefs,
        updateTaskRef,
        customTasks,
        addTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
}
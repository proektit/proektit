export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  category: string;
  color: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  datetime: Date;
  type: 'task' | 'event' | 'custom';
  completed: boolean;
}

export interface Stats {
  tasksCompleted: number;
  tasksTotal: number;
  eventsToday: number;
  productivity: number;
}
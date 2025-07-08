import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckSquare, Bell, BarChart3, Moon, Sun } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { Calendar } from './components/Calendar';
import { Reminders } from './components/Reminders';
import { Task, Event, Reminder, Stats } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

type Tab = 'dashboard' | 'tasks' | 'calendar' | 'reminders';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [events, setEvents] = useLocalStorage<Event[]>('events', []);
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('reminders', []);

  // Calculate stats
  const stats: Stats = {
    tasksCompleted: tasks.filter(task => task.completed).length,
    tasksTotal: tasks.length,
    eventsToday: events.filter(event => {
      const today = new Date();
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === today.toDateString();
    }).length,
    productivity: tasks.length > 0 ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) : 0
  };

  // Task handlers
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, ...updates } : task));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Event handlers
  const handleAddEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString()
    };
    setEvents([...events, newEvent]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  // Reminder handlers
  const handleAddReminder = (reminderData: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: Date.now().toString()
    };
    setReminders([...reminders, newReminder]);
  };

  const handleUpdateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, ...updates } : reminder
    ));
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  const tabs = [
    { id: 'dashboard', name: 'Табло', icon: BarChart3 },
    { id: 'tasks', name: 'Задачи', icon: CheckSquare },
    { id: 'calendar', name: 'Календар', icon: CalendarIcon },
    { id: 'reminders', name: 'Напомняния', icon: Bell }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 backdrop-blur-sm bg-opacity-95' 
          : 'bg-white border-gray-200 backdrop-blur-sm bg-opacity-95'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Organizer Pro
                </h1>
              </div>
              
              <div className="hidden md:flex items-center gap-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? darkMode
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-blue-100 text-blue-700 shadow-sm'
                          : darkMode
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`md:hidden border-b transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between px-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex flex-col items-center gap-1 py-3 px-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : darkMode
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && (
            <Dashboard tasks={tasks} events={events} stats={stats} />
          )}
          {activeTab === 'tasks' && (
            <TaskList
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
          {activeTab === 'calendar' && (
            <Calendar
              events={events}
              onAddEvent={handleAddEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          )}
          {activeTab === 'reminders' && (
            <Reminders
              reminders={reminders}
              onAddReminder={handleAddReminder}
              onUpdateReminder={handleUpdateReminder}
              onDeleteReminder={handleDeleteReminder}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
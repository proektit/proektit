import React, { useState, useEffect } from 'react';
import { Bell, Plus, X, Clock, Calendar } from 'lucide-react';
import { Reminder } from '../types';

interface RemindersProps {
  reminders: Reminder[];
  onAddReminder: (reminder: Omit<Reminder, 'id'>) => void;
  onDeleteReminder: (id: string) => void;
  onUpdateReminder: (id: string, updates: Partial<Reminder>) => void;
}

export const Reminders: React.FC<RemindersProps> = ({
  reminders,
  onAddReminder,
  onDeleteReminder,
  onUpdateReminder
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    datetime: '',
    type: 'custom' as const
  });

  // Check for due reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach(reminder => {
        const reminderTime = new Date(reminder.datetime);
        const timeDiff = reminderTime.getTime() - now.getTime();
        
        // Notify if reminder is due (within 1 minute)
        if (timeDiff <= 60000 && timeDiff > 0 && !reminder.completed) {
          if (Notification.permission === 'granted') {
            new Notification(reminder.title, {
              body: reminder.description || 'Време за напомнянето!',
              icon: '/favicon.ico'
            });
          }
          
          // Mark as completed
          onUpdateReminder(reminder.id, { completed: true });
        }
      });
    };

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [reminders, onUpdateReminder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.title.trim() || !newReminder.datetime) return;

    onAddReminder({
      ...newReminder,
      datetime: new Date(newReminder.datetime),
      completed: false
    });

    setNewReminder({
      title: '',
      description: '',
      datetime: '',
      type: 'custom'
    });
    setShowAddForm(false);
  };

  const upcomingReminders = reminders
    .filter(reminder => !reminder.completed && new Date(reminder.datetime) > new Date())
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  const completedReminders = reminders
    .filter(reminder => reminder.completed)
    .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('bg-BG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diff = targetDate.getTime() - now.getTime();
    
    if (diff < 0) return 'Изминало';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} дни`;
    if (hours > 0) return `${hours} часа`;
    return `${minutes} минути`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-600" />
          Напомняния
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ново напомняне
        </button>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заглавие *
              </label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Въведете заглавие..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={newReminder.description}
                onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Добавете описание..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата и час *
                </label>
                <input
                  type="datetime-local"
                  value={newReminder.datetime}
                  onChange={(e) => setNewReminder({ ...newReminder, datetime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип
                </label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="custom">Персонално</option>
                  <option value="task">Задача</option>
                  <option value="event">Събитие</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Създай напомняне
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Отказ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upcoming Reminders */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600" />
          Предстоящи напомняния
        </h3>
        <div className="space-y-3">
          {upcomingReminders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Няма предстоящи напомняния</p>
          ) : (
            upcomingReminders.map(reminder => {
              const timeUntil = getTimeUntil(reminder.datetime);
              const isUrgent = new Date(reminder.datetime).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;
              
              return (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    isUrgent 
                      ? 'bg-red-50 border-red-500' 
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{reminder.title}</h4>
                      {reminder.description && (
                        <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDateTime(reminder.datetime)}
                        </div>
                        <div className={`flex items-center gap-1 ${isUrgent ? 'text-red-600' : 'text-blue-600'}`}>
                          <Clock className="w-4 h-4" />
                          {timeUntil}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateReminder(reminder.id, { completed: true })}
                        className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                        title="Маркирай като завършено"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteReminder(reminder.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-600">Завършени напомняния</h3>
          <div className="space-y-3">
            {completedReminders.slice(0, 5).map(reminder => (
              <div
                key={reminder.id}
                className="p-4 bg-gray-50 rounded-lg opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-700 line-through">{reminder.title}</h4>
                    {reminder.description && (
                      <p className="text-sm text-gray-500 mt-1">{reminder.description}</p>
                    )}
                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDateTime(reminder.datetime)}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteReminder(reminder.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
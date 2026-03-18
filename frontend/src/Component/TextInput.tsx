import { useState, useEffect, useCallback } from 'react';
import TextList from './TextList';

export interface Task {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

const API_BASE = 'http://localhost:5000/api/tasks';

export default function TextInput() {
  const [task, setTask] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [adding, setAdding] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(API_BASE);
        const data: Task[] = await res.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = useCallback(async () => {
    if (task.trim() === '') return;
    setAdding(true);
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.trim(), dueDate: date || 'No date' }),
      });
      const newTask: Task = await res.json();
      setTasks((prev) => [newTask, ...prev]);
      setTask('');
      setDate('');
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setAdding(false);
    }
  }, [task, date]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddTask();
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const circumference = 2 * Math.PI * 22;

  

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 25%, #ffafcc 60%, #cdb4db 100%)' }}
    >
      {/* Soft decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-8%] right-[-5%] w-96 h-96 rounded-full opacity-40 blur-3xl" style={{ background: '#ffafcc' }} />
        <div className="absolute bottom-[-5%] left-[-8%] w-80 h-80 rounded-full opacity-35 blur-3xl" style={{ background: '#a2d2ff' }} />
        <div className="absolute top-[45%] left-[55%] w-64 h-64 rounded-full opacity-30 blur-3xl" style={{ background: '#bde0fe' }} />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Main Card */}
        <div
          className="rounded-3xl shadow-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1.5px solid rgba(255,175,204,0.4)',
          }}
        >
          {/* Top accent stripe */}
          <div
            className="h-1.5"
            style={{ background: 'linear-gradient(90deg, #ffafcc, #cdb4db, #a2d2ff, #bde0fe)' }}
          />

          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-xs font-bold tracking-[0.22em] uppercase mb-1.5" style={{ color: '#c77dff' }}>
                  My Workspace
                </p>
                <h1 className="text-3xl font-extrabold leading-none" style={{ color: '#3d1a6e', letterSpacing: '-0.02em' }}>
                  Task Manager
                </h1>
                <p className="text-sm mt-1" style={{ color: '#a487c3' }}>
                  Stay on top of your day ✨
                </p>
              </div>

              {/* Circular progress */}
              <div className="flex flex-col items-center gap-1">
                <div className="relative w-14 h-14">
                  <svg className="w-14 h-14" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#f3e8ff" strokeWidth="5" />
                    <circle
                      cx="28" cy="28" r="22" fill="none"
                      stroke="url(#pinkGrad)" strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - progress / 100)}
                      style={{ transition: 'stroke-dashoffset 0.7s ease' }}
                    />
                    <defs>
                      <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffafcc" />
                        <stop offset="100%" stopColor="#cdb4db" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span
                    className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                    style={{ color: '#7c3aed' }}
                  >
                    {progress}%
                  </span>
                </div>
                <span className="text-xs" style={{ color: '#a487c3' }}>
                  {completedCount}/{tasks.length} done
                </span>
              </div>
            </div>

            {/* Input Section */}
            <div className="flex flex-col gap-3 mb-7">
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What needs to be done?"
                className="w-full rounded-2xl px-5 py-3.5 text-sm font-medium outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '1.5px solid #e9d5ff',
                  color: '#3d1a6e',
                }}
                onFocus={(e) => { e.currentTarget.style.border = '1.5px solid #c084fc'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(192,132,252,0.15)'; }}
                onBlur={(e) => { e.currentTarget.style.border = '1.5px solid #e9d5ff'; e.currentTarget.style.boxShadow = 'none'; }}
              />

              <div className="flex gap-3">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200 cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    border: '1.5px solid #e9d5ff',
                    color: '#7c3aed',
                  }}
                />

                <button
                  onClick={handleAddTask}
                  disabled={adding || task.trim() === ''}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #ffafcc 0%, #cdb4db 100%)',
                    color: '#3d1a6e',
                    boxShadow: '0 4px 20px rgba(205,180,219,0.55)',
                  }}
                >
                  {adding ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    '＋ Add Task'
                  )}
                </button>
              </div>
            </div>

            {/* Soft divider */}
            <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, #e9d5ff, transparent)' }} />

            {/* Task List */}
            <TextList tasks={tasks} setTasks={setTasks} loading={loading} />
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center text-xs mt-4 tracking-widest uppercase font-semibold"
          style={{ color: 'rgba(124,58,237,0.45)' }}
        >
          TaskFlow · 2025
        </p>
      </div>
    </div>
  );
}

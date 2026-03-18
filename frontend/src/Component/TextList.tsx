import { Task } from './TextInput';

interface TextListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  loading?: boolean;
}

const API_BASE = 'http://localhost:5000/api/tasks';

const isOverdue = (dueDate: string) => {
  if (!dueDate || dueDate === "No date") return false;

  const today = new Date();
  const taskDate = new Date(dueDate);

  today.setHours(0,0,0,0);
  taskDate.setHours(0,0,0,0);

  return taskDate < today;
};

export default function TextList({ tasks, setTasks, loading = false }: TextListProps) {

  const handleDelete = async (taskId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await fetch(`${API_BASE}/${taskId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
  setTasks((prev) =>
    prev.map((t) =>
      t.id === taskId ? { ...t, completed: !completed } : t
    )
  );

  try {
    const res = await fetch(`${API_BASE}/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
    });

    const updatedTask: Task = await res.json();

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? updatedTask : t))
    );

  } catch (error) {
    console.error("Error updating task:", error);
  }
};

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 rounded-2xl animate-pulse"
            style={{ background: 'rgba(205,180,219,0.2)', opacity: 1 - i * 0.2 }}
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: 'rgba(255,175,204,0.2)' }}
        >
          🌸
        </div>
        <p className="text-sm text-center" style={{ color: '#a487c3' }}>
          No tasks yet!<br />
          <span className="text-xs" style={{ color: '#c9b8dc' }}>Add something above to get started.</span>
        </p>
      </div>
    );
  }

  const pending = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  return (
    <div className="flex flex-col gap-1">
      {pending.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-bold tracking-widest uppercase mb-3 px-1" style={{ color: '#c77dff' }}>
            Pending · {pending.length}
          </p>
          <ul className="flex flex-col gap-2">
            {pending.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={handleToggleComplete} onDelete={handleDelete} />
            ))}
          </ul>
        </div>
      )}

      {done.length > 0 && (
        <div className="mt-1">
          <p className="text-xs font-bold tracking-widest uppercase mb-3 px-1" style={{ color: '#c9b8dc' }}>
            Completed · {done.length}
          </p>
          <ul className="flex flex-col gap-2">
            {done.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={handleToggleComplete} onDelete={handleDelete} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const overdue = isOverdue(task.dueDate) && !task.completed;
  return (
    <li
      className="group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
      style={{
        background: task.completed
          ? 'rgba(233,213,255,0.25)'
          : 'rgba(255,255,255,0.75)',
        border: task.completed
          ? '1.5px solid rgba(205,180,219,0.3)'
          : '1.5px solid rgba(255,175,204,0.4)',
        boxShadow: task.completed ? 'none' : '0 2px 12px rgba(255,175,204,0.15)',
        opacity: task.completed ? 0.6 : 1,
      }}
    >
      {/* Toggle circle */}
      <button
        // onClick={() => onToggle(task.id, task.completed)}
        onClick={() => !overdue && onToggle(task.id, task.completed)}
disabled={overdue}
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: task.completed
            ? 'linear-gradient(135deg, #ffafcc, #cdb4db)'
            : 'transparent',
          border: task.completed
            ? 'none'
            : '2px solid #d8b4fe',
          boxShadow: task.completed ? '0 2px 8px rgba(255,175,204,0.5)' : 'none',
        }}
        aria-label="Toggle task"
      >
        {task.completed ? (
  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
) : null}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{
  color: overdue ? '#dc2626' : task.completed ? '#6b7280' : '#3d1a6e',
  textDecoration: task.completed || overdue ? 'line-through' : 'none',
}}
        >
          {task.title}
        </p>
        {task.dueDate && task.dueDate !== 'No date' && (
          <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#2d0b59' }}>
            <span>🗓</span>
            {/* {task.dueDate} */}
            {task.dueDate}
{overdue && <span> ⚠️</span>}
          </p>
        )}
      </div>

      {/* Delete */}
      <button
       onClick={() => onDelete(task.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-150"
        style={{ color: '#e879a0' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(232,121,160,0.12)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        aria-label="Delete task"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  );
}

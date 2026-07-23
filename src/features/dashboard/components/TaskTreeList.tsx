import React from 'react';
import { Plus } from 'lucide-react';
import { TeamTask } from '../types';
// import TaskCard from './cards/TaskCard';

interface TaskTreeListProps {
  tasks: TeamTask[];
  onToggleActivity: (taskId: number, activityId: number) => void;
}

export default function TaskTreeList({ tasks, onToggleActivity }: TaskTreeListProps) {
  return (
    <section className="w-full lg:w-2/2 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase flex items-center gap-2">
          <span>Active Task Trees</span>
          <span className="w-5 h-5 bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center rounded-full">{tasks.length}</span>
        </h3>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm">
          <Plus size={14} />
          <span>Assign New Task</span>
        </button>
      </div>

      {/* {tasks.map((task) => (
        // <TaskCard key={task.id} node={task} onToggleActivity={onToggleActivity} />
      ))} */}
    </section>
  );
}
'use client';

import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/lib/store';
// import GoalAccordion from '@/src/features/tasks/components/tasks/GoalAccordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckSquare, ListPlus } from 'lucide-react';
import {useAuth}  from '@/src/features/auth/hooks/useAuth';



export default function TeamLeadTasksPage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
//   const { loading } = useAuthContext();
  
//   if (loading) {
//     return (
//         <div className="flex justify-center items-center h-screen">
//             Loading...
//         </div>
//     );
// }

if (!user) {
    return null;
}
if (user.role !== "TEAM_LEAD") {
    return (
        <div className="flex items-center justify-center h-screen text-red-600 text-xl font-semibold">
            Access Denied
        </div>
    );
}

// Simulated login context fallback token
const currentUserId = user?.id;

const goals = useSelector((state: RootState) => state.tasks.goals);
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedKeys, setSelectedKeys] = useState('');
const [subtaskTitle, setSubtaskTitle] = useState('');
  const [assignedEmpId, setAssignedEmpId] = useState('');

  // Extract all tasks assigned to this Team Lead
  const relevantGoalsDataset = useMemo(() => {
    return goals.map(g => {
      const standardTasks = g.tasks.filter(t => t.assignedToId === currentUserId);
      return standardTasks.length > 0 ? { ...g, tasks: standardTasks } : null;
    }).filter(Boolean) as any[];
  }, [goals, currentUserId]);

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKeys || !subtaskTitle || !assignedEmpId) return;

    const [goalId, taskId] = selectedKeys.split('::');

    // dispatch(addSubtaskToTask({
    //   goalId,
    //   taskId,
    //   subtask: {
    //     id: `subtask-${Date.now()}`,
    //     title: subtaskTitle,
    //     isCompleted: false,
    //     assignedToId: assignedEmpId
    //   }
    // }));

    setSubtaskTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Team Lead Command Console</h1>
          <p className="text-xs text-slate-500">Break tasks down into specific action items and assign them to your team.</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-xs hover:bg-blue-700 transition-all cursor-pointer">
            <ListPlus className="w-4 h-4" /> Create Subtask Action
          </DialogTrigger>
          <DialogContent className="bg-white rounded-xl border border-slate-200 p-5">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900">Deploy Employee Action Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubtask} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Target Parent Task Line</label>
                <Select onValueChange={setSelectedKeys} required>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200 text-xs">
                    <SelectValue placeholder="Select target task queue" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border rounded-xl">
                    {relevantGoalsDataset.map(g => 
                      g.tasks.map((t: any) => (
                        <SelectItem key={t.id} value={`${g.id}::${t.id}`}>{g.title} ➔ {t.title}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Subtask Action Description</label>
                <input type="text" required value={subtaskTitle} onChange={e => setSubtaskTitle(e.target.value)} placeholder="e.g., Update system environment schema logs" className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Assign Field Employee</label>
                <Select onValueChange={setAssignedEmpId} required>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200 text-xs">
                    <SelectValue placeholder="Select target employee field operator" />
                  </SelectTrigger>
                  {/* <SelectContent className="bg-white border rounded-xl">
                    {myEmployees.map(emp => <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>)}
                  </SelectContent> */}
                </Select>
              </div>
              <button type="submit" className="w-full bg-slate-950 text-white py-2 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer">Deploy Subtask</button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><CheckSquare className="w-4 h-4" /> Active Team Task Trackers</h3>
        {/* <GoalAccordion goals={relevantGoalsDataset} interactiveRole="team_lead" /> */}
      </div>
    </div>
  );
}
// import React from 'react';
// import { Clock, UserCheck, CheckSquare, Square } from 'lucide-react';
// import { TeamTask } from '../../types';

// interface TaskCardProps {
//   node: TeamTask;
//   onToggleActivity: (taskId: number, activityId: number) => void;
// }

// export default function TaskCard({ node, onToggleActivity }: TaskCardProps) {
//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
//       {/* Tier 1 Header */}
//       <div className="p-5 bg-slate-50/70 border-b border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm border border-slate-300">
//             {node.employee.split(' ').map(n => n[0]).join('')}
//           </div>
//           <div>
//             <h4 className="font-bold text-slate-900 text-base leading-none">{node.employee}</h4>
//             <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
//               <UserCheck size={12} className="text-slate-400" />
//               <span>Role: {node.role}</span>
//             </p>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-2 self-start sm:self-center">
//           <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
//             node.urgency === 'high' ? 'bg-rose-50 border border-rose-200 text-rose-700' : 'bg-amber-50 border border-amber-200 text-amber-700'
//           }`}>
//             <Clock size={12} />
//             <span>{node.deadline}</span>
//           </span>
//         </div>
//       </div>

//       {/* Tier 2 Content Block */}
//       <div className="p-5 border-b border-slate-100">
//         <div className="flex items-start justify-between gap-4 mb-3">
//           <h5 className="font-bold text-slate-800 text-md tracking-tight leading-snug">{node.taskTitle}</h5>
//           <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">{node.progress}%</span>
//         </div>
//         <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
//           <div 
//             className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-500" 
//             style={{ width: `${node.progress}%` }}
//           />
//         </div>
//       </div>

//       {/* Tier 3 List Detail */}
//       <div className="p-5 bg-slate-50/30">
//         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Sub-Activity Action Deliverables</p>
//         <ul className="space-y-2.5">
//           {node.activities.map((act) => (
//             <li key={act.id} className="flex items-start gap-3 text-sm group">
//               <button 
//                 onClick={() => onToggleActivity(node.id, act.id)}
//                 className={`mt-0.5 shrink-0 transition-colors ${act.done ? 'text-emerald-500' : 'text-slate-300 group-hover:text-slate-400'}`}
//               >
//                 {act.done ? (
//                   <CheckSquare size={16} className="text-emerald-500 fill-emerald-50" />
//                 ) : (
//                   <Square size={16} className="text-slate-300" />
//                 )}
//               </button>
//               <span className={`leading-tight font-medium select-none transition-all ${act.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
//                 {act.text}
//               </span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
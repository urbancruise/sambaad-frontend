import { EmployeeWorkload } from "../types";

interface Props {
  workload: EmployeeWorkload[];
}

const WorkloadCard = ({ workload }: Props) => {
  return (
    <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <h2 className="font-semibold text-base text-slate-200 tracking-wide mb-4">Employee Workload</h2>

      {/* Light card container as seen in reference image */}
      <div className="bg-[#e2e8f0] rounded-xl p-3 text-slate-900 shadow-inner overflow-x-auto">
        <table className="w-full text-left text-xs border-separate border-spacing-y-1.5">
          <thead>
            <tr className="text-slate-500 font-medium">
              <th className="pb-2 px-3">Employee</th>
              <th className="pb-2 px-3">Tasks</th>
              <th className="pb-2 px-3">Pending Activities</th>
              <th className="pb-2 px-3">Overdue</th>
              <th className="pb-2 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workload.map((employee) => (
              <tr key={employee.employeeId} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <td className="py-2.5 px-3 font-semibold text-slate-800 rounded-l-lg">{employee.employeeName}</td>
                <td className="py-2.5 px-3 text-slate-600">Tasks {employee.activeTasks}</td>
                <td className="py-2.5 px-3 text-slate-600">Pending {employee.pendingActivities}</td>
                <td className="py-2.5 px-3">
                  {employee.overdueActivities > 0 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                      {employee.overdueActivities} Overdue
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-right rounded-r-lg">
                  <button className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 hover:text-blue-600 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkloadCard;
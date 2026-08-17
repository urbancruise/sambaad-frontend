const AttentionCard = () => {
  return (
    <div className="bg-[#fff5f5] border border-rose-200/60 rounded-2xl p-5 shadow-sm h-full flex flex-col justify-between dark:bg-rose-950/20 dark:border-rose-900/40">
      <h2 className="font-extrabold text-lg text-rose-900 tracking-tight mb-4 dark:text-rose-200">
        Needs Attention
      </h2>

      <div className="space-y-3 flex-1 flex flex-col justify-center">
        {/* Overdue Alert Item */}
        <div className="bg-white border border-rose-200 rounded-xl p-3.5 shadow-xs dark:bg-slate-900 dark:border-rose-900/50">
          <p className="font-bold text-sm text-rose-600 dark:text-rose-400">1 Overdue Task</p>
          <p className="text-xs font-medium text-slate-500 mt-0.5 dark:text-slate-400">
            Abhishek Sharma - Project Task Alpha
          </p>
        </div>

        {/* Pending Activities Item */}
        <div className="bg-white border border-amber-200 rounded-xl p-3.5 shadow-xs dark:bg-slate-900 dark:border-amber-900/50">
          <p className="font-bold text-sm text-amber-700 dark:text-amber-400">2 Pending Activities</p>
          <p className="text-xs font-medium text-slate-500 mt-0.5 dark:text-slate-400">
            Requires manager approval
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttentionCard;
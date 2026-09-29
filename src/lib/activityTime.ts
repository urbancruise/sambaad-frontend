export interface TimedActivity {
  status: string;
  estimatedMinutes?: number | null;
  actualMinutes?: number | null;
  dueDate?: string | null;
  completedAt?: string | null;
}

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const getActivityTiming = (a: TimedActivity) => {
  const due = a.dueDate ? startOfDay(new Date(a.dueDate)) : null;
  const open = a.status !== "COMPLETED" && a.status !== "CANCELLED";

  const overdue = !!due && open && due < startOfDay(new Date());
  const completedLate =
    !!due && a.status === "COMPLETED" && !!a.completedAt &&
    startOfDay(new Date(a.completedAt)) > due;

  let time: { onTime: boolean; label: string; text: string; badge: string } | null = null;
  if (
    a.status === "COMPLETED" &&
    a.estimatedMinutes != null &&
    a.actualMinutes != null &&
    a.actualMinutes > 0 // ignores old rows that still hold 0
  ) {
    const diff = a.actualMinutes - a.estimatedMinutes;
    time = diff <= 0
      ? { onTime: true, label: "On time", text: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" }
      : { onTime: false, label: `Delayed +${diff} min`, text: "text-yellow-600", badge: "bg-yellow-100 text-yellow-700" };
  }

  return { overdue, completedLate, time };
};
"use client";

import { useMemo } from "react";
import { Flame, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HabitWithEntries } from "@/lib/types";
import { toggleHabitEntry, deleteHabit } from "@/lib/actions/habits";
import { computeStreak } from "@/components/modules/habits/streak-utils";
import { HabitFormDialog } from "@/components/modules/habits/habit-form-dialog";
import { HABIT_ICONS, type HabitIconName } from "@/components/modules/habits/habit-icons";

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function HabitTracker({ habits }: { habits: HabitWithEntries[] }) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const days = useMemo(() => {
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(today.getFullYear(), today.getMonth(), i + 1));
  }, [today]);

  const topStreak = habits.reduce(
    (best, h) => {
      const streak = computeStreak(h.entries);
      return streak > best.streak ? { habit: h, streak } : best;
    },
    { habit: null as HabitWithEntries | null, streak: 0 }
  );

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex justify-end">
        <HabitFormDialog />
      </div>

      {topStreak.habit && topStreak.streak >= 3 && (
        <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
          <Flame className="h-4 w-4 shrink-0" />
          <span>
            You&apos;ve kept up <strong>{topStreak.habit.name}</strong> for{" "}
            <strong>{topStreak.streak} days</strong> in a row. Keep it up!
          </span>
        </div>
      )}

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[640px] border-separate border-spacing-y-1 text-left">
          <thead>
            <tr>
              <th className="w-40 text-xs font-medium text-muted-foreground">Habit</th>
              {days.map((d) => (
                <th
                  key={d.toISOString()}
                  className={cn(
                    "w-6 pb-1 text-center text-[10px] font-normal text-muted-foreground",
                    toDateKey(d) === toDateKey(today) && "font-semibold text-primary"
                  )}
                >
                  {d.getDate()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => {
              const Icon = HABIT_ICONS[habit.icon as HabitIconName] ?? Sparkles;
              const entryMap = new Map(habit.entries.map((e) => [toDateKey(new Date(e.date)), e.completed]));
              return (
                <tr key={habit.id} className="group">
                  <td className="flex items-center gap-1.5 py-0.5 pr-2 text-xs text-foreground">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{habit.name}</span>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="ml-auto shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                      aria-label={`Delete habit ${habit.name}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </td>
                  {days.map((d) => {
                    const key = toDateKey(d);
                    const isFuture = d > today;
                    const completed = entryMap.get(key) ?? false;
                    return (
                      <td key={key} className="text-center">
                        <button
                          disabled={isFuture}
                          onClick={() => toggleHabitEntry(habit.id, d)}
                          className={cn(
                            "h-5 w-5 rounded-[4px] border border-border transition-colors",
                            completed && "border-accent bg-accent",
                            isFuture && "cursor-not-allowed opacity-30",
                            !isFuture && !completed && "cursor-pointer hover:border-accent/60"
                          )}
                          aria-label={`${habit.name} on ${key}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { Pause, Play, RotateCcw, SkipForward, Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePomodoroStore, POMODORO_DURATIONS } from "@/store/pomodoro-store";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function PomodoroTimer() {
  const { mode, secondsLeft, isRunning, linkedTaskTitle, start, pause, reset, tick, skip, unlinkTask } =
    usePomodoroStore();

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [isRunning, tick]);

  const total = mode === "work" ? POMODORO_DURATIONS.WORK_SECONDS : POMODORO_DURATIONS.BREAK_SECONDS;
  const progress = 1 - secondsLeft / total;
  const circumference = 2 * Math.PI * 42;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="42" className="stroke-muted" strokeWidth="7" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="42"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            className={cn("transition-[stroke-dashoffset] duration-1000 ease-linear", mode === "work" ? "stroke-primary" : "stroke-accent")}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-semibold tabular-nums">{formatTime(secondsLeft)}</span>
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {mode === "work" ? "Focus" : "Break"}
          </span>
        </div>
      </div>

      {linkedTaskTitle ? (
        <div className="flex max-w-full items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs">
          <Timer className="h-3 w-3 shrink-0 text-primary" />
          <span className="truncate">{linkedTaskTitle}</span>
          <button onClick={unlinkTask} aria-label="Unlink task">
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Link a task from the To-Do list</p>
      )}

      <div className="flex items-center gap-2">
        {isRunning ? (
          <Button size="icon" className="h-9 w-9 rounded-full" onClick={pause}>
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="icon" className="h-9 w-9 rounded-full" onClick={start}>
            <Play className="h-4 w-4" />
          </Button>
        )}
        <Button size="icon" variant="outline" className="h-9 w-9 rounded-full" onClick={reset} title="Reset">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" variant="outline" className="h-9 w-9 rounded-full" onClick={skip} title="Skip">
          <SkipForward className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

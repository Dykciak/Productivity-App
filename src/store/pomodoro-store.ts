import { create } from "zustand";

export type PomodoroMode = "work" | "break";

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

interface PomodoroState {
  mode: PomodoroMode;
  secondsLeft: number;
  isRunning: boolean;
  linkedTaskId: string | null;
  linkedTaskTitle: string | null;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  skip: () => void;
  linkTask: (id: string, title: string) => void;
  unlinkTask: () => void;
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  mode: "work",
  secondsLeft: WORK_SECONDS,
  isRunning: false,
  linkedTaskId: null,
  linkedTaskTitle: null,

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  reset: () =>
    set({
      isRunning: false,
      mode: "work",
      secondsLeft: WORK_SECONDS,
    }),
  skip: () => {
    const nextMode: PomodoroMode = get().mode === "work" ? "break" : "work";
    set({
      mode: nextMode,
      secondsLeft: nextMode === "work" ? WORK_SECONDS : BREAK_SECONDS,
      isRunning: false,
    });
  },
  tick: () => {
    const { secondsLeft, mode } = get();
    if (secondsLeft <= 1) {
      const nextMode: PomodoroMode = mode === "work" ? "break" : "work";
      set({
        mode: nextMode,
        secondsLeft: nextMode === "work" ? WORK_SECONDS : BREAK_SECONDS,
        isRunning: false,
      });
    } else {
      set({ secondsLeft: secondsLeft - 1 });
    }
  },
  linkTask: (id, title) => set({ linkedTaskId: id, linkedTaskTitle: title }),
  unlinkTask: () => set({ linkedTaskId: null, linkedTaskTitle: null }),
}));

export const POMODORO_DURATIONS = { WORK_SECONDS, BREAK_SECONDS };

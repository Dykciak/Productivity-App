import { Target, Repeat, Timer, NotebookPen } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { GreetingHeader } from "@/components/modules/dashboard/greeting-header";
import { WeatherWidget } from "@/components/modules/dashboard/weather-widget";
import { OneThingCard } from "@/components/modules/dashboard/one-thing-card";
import { PlannerBoard } from "@/components/modules/planner-board";
import { HabitTracker } from "@/components/modules/habits/habit-tracker";
import { GoalsList } from "@/components/modules/goals/goals-list";
import { EveningReflectionForm } from "@/components/modules/journal/evening-reflection-form";
import { PomodoroTimer } from "@/components/modules/pomodoro/pomodoro-timer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function DashboardPage() {
  const today = startOfDay(new Date());

  const [tasks, habits, projects, journalEntry] = await Promise.all([
    prisma.task.findMany({ include: { timeBlock: true }, orderBy: { createdAt: "asc" } }),
    prisma.habitDef.findMany({ include: { entries: true }, orderBy: { createdAt: "asc" } }),
    prisma.project.findMany({
      where: { category: "general" },
      include: { subtasks: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.journalEntry.findUnique({ where: { date: today } }),
  ]);

  const oneThingTask = tasks.find((t) => t.isOneThing) ?? null;

  return (
    <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <GreetingHeader />

      <section className="bento-grid mt-6">
        <Card className="bento-cell flex flex-col justify-center p-5 lg:col-span-1">
          <WeatherWidget />
        </Card>

        <Card className="bento-cell bg-primary p-5 lg:col-span-2">
          <OneThingCard task={oneThingTask} />
        </Card>

        <Card className="bento-cell flex flex-col p-5 lg:col-span-1">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Timer className="h-3.5 w-3.5" /> Pomodoro
          </p>
          <PomodoroTimer />
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Plan your day
        </h2>
        <PlannerBoard tasks={tasks} />
      </section>

      <section className="mt-10">
        <Card className="bento-cell">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Repeat className="h-4 w-4 text-primary" />
            <CardTitle>Habit Tracker</CardTitle>
          </CardHeader>
          <div className="px-5 pb-5">
            <HabitTracker habits={habits} />
          </div>
        </Card>
      </section>

      <section className="mt-10">
        <Card className="bento-cell">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Target className="h-4 w-4 text-primary" />
            <CardTitle>Goals &amp; Projects</CardTitle>
          </CardHeader>
          <div className="px-5 pb-5">
            <GoalsList projects={projects} />
          </div>
        </Card>
      </section>

      <section className="mt-10 mb-6">
        <Card className="bento-cell">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <NotebookPen className="h-4 w-4 text-primary" />
            <CardTitle>Evening Reflection</CardTitle>
          </CardHeader>
          <div className="px-5 pb-5">
            <EveningReflectionForm existingEntry={journalEntry} />
          </div>
        </Card>
      </section>
    </main>
  );
}

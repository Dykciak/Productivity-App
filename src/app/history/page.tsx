import { format } from "date-fns";
import { CheckCircle2, History as HistoryIcon, NotebookPen, Repeat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { computeStreak } from "@/components/modules/habits/streak-utils";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const [completedTasks, habits, journalEntries] = await Promise.all([
    prisma.task.findMany({
      where: { completed: true },
      orderBy: { completedAt: "desc" },
      take: 50,
    }),
    prisma.habitDef.findMany({ include: { entries: true }, orderBy: { createdAt: "asc" } }),
    prisma.journalEntry.findMany({ orderBy: { date: "desc" }, take: 30 }),
  ]);

  return (
    <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <HistoryIcon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Productivity History</h1>
          <p className="text-sm text-muted-foreground">
            A record of what you&apos;ve finished, kept up, and reflected on.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" /> Completed tasks
          </h2>
          <Card className="bento-cell">
            <CardContent className="divide-y divide-border p-0">
              {completedTasks.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">Nothing completed yet.</p>
              ) : (
                completedTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <span className="truncate text-sm text-foreground">{task.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {task.completedAt ? format(new Date(task.completedAt), "MMM d, yyyy") : "—"}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Repeat className="h-4 w-4" /> Habit completion log
          </h2>
          <Card className="bento-cell">
            <CardContent className="divide-y divide-border p-0">
              {habits.map((habit) => {
                const totalCompleted = habit.entries.filter((e) => e.completed).length;
                const streak = computeStreak(habit.entries);
                return (
                  <div key={habit.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <span className="text-sm text-foreground">{habit.name}</span>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="outline">{totalCompleted} total</Badge>
                      {streak > 0 && <Badge variant="success">{streak}-day streak</Badge>}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <NotebookPen className="h-4 w-4" /> Past reflections
          </h2>
          <div className="space-y-3">
            {journalEntries.length === 0 ? (
              <Card className="bento-cell">
                <CardContent className="p-5 text-sm text-muted-foreground">No reflections logged yet.</CardContent>
              </Card>
            ) : (
              journalEntries.map((entry) => (
                <Card key={entry.id} className="bento-cell">
                  <CardHeader className="flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium text-foreground">
                      {format(new Date(entry.date), "EEEE, MMMM d")}
                    </CardTitle>
                    <Badge>{entry.rating}/10</Badge>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-3 pt-0 text-sm sm:grid-cols-3">
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Grateful for</p>
                      <p className="text-foreground">{entry.grateful}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Went well</p>
                      <p className="text-foreground">{entry.wentWell}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Could improve</p>
                      <p className="text-foreground">{entry.couldImprove}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

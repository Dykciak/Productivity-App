import { GraduationCap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { GoalsList } from "@/components/modules/goals/goals-list";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LearningPlanPage() {
  const modules = await prisma.project.findMany({
    where: { category: "learning" },
    include: { subtasks: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });

  const totalSubtasks = modules.reduce((sum, m) => sum + m.subtasks.length, 0);
  const completedSubtasks = modules.reduce(
    (sum, m) => sum + m.subtasks.filter((s) => s.completed).length,
    0
  );
  const overallPct = totalSubtasks === 0 ? 0 : Math.round((completedSubtasks / totalSubtasks) * 100);

  return (
    <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">12-Month Learning Plan</h1>
          <p className="text-sm text-muted-foreground">
            Full-stack + AI engineering, school + self-study, no full-time job.
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Overall progress</span>
          <span className="font-semibold tabular-nums text-primary">
            {completedSubtasks} / {totalSubtasks} ({overallPct}%)
          </span>
        </div>
        <Progress value={overallPct} className="h-2" />
      </div>

      <GoalsList projects={modules} category="learning" constrainHeight={false} />
    </main>
  );
}

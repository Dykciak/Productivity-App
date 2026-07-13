import { NotebookText } from "lucide-react";
import { NotesWorkspace } from "@/components/modules/notes/notes-workspace";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await prisma.note.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <NotebookText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Notes</h1>
          <p className="text-sm text-muted-foreground">Jot down and format anything worth keeping.</p>
        </div>
      </div>

      <NotesWorkspace initialNotes={notes} />
    </main>
  );
}

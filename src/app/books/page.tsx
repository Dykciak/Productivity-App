import { Library } from "lucide-react";
import { BookTracker } from "@/components/modules/books/book-tracker";
import { AddBookDialog } from "@/components/modules/books/add-book-dialog";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  const books = await prisma.book.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Library className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Book Tracker</h1>
            <p className="text-sm text-muted-foreground">Keep track of what you&apos;re reading.</p>
          </div>
        </div>
        <AddBookDialog />
      </div>

      <BookTracker books={books} />
    </main>
  );
}

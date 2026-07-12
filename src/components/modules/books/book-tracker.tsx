import { BookMarked, BookOpenCheck, Library } from "lucide-react";
import type { Book, BookStatus } from "@/lib/types";
import { BookCard } from "@/components/modules/books/book-card";

const COLUMNS: { status: BookStatus; label: string; icon: typeof Library }[] = [
  { status: "READING", label: "Currently Reading", icon: BookOpenCheck },
  { status: "WANT_TO_READ", label: "Want to Read", icon: BookMarked },
  { status: "READ", label: "Read", icon: Library },
];

export function BookTracker({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {COLUMNS.map((col) => {
        const Icon = col.icon;
        const columnBooks = books.filter((b) => b.status === col.status);
        return (
          <div key={col.status}>
            <div className="mb-3 flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
              <span className="text-xs text-muted-foreground">{columnBooks.length}</span>
            </div>
            {columnBooks.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                No books here yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2">
                {columnBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

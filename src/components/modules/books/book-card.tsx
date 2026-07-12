"use client";

import { BookOpen, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Book, BookStatus } from "@/lib/types";
import { deleteBook, updateBookStatus } from "@/lib/actions/books";

const STATUS_LABELS: Record<BookStatus, string> = {
  READING: "Currently Reading",
  WANT_TO_READ: "Want to Read",
  READ: "Read",
};

export function BookCard({ book }: { book: Book }) {
  const isRead = book.status === "READ";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card transition-opacity",
        isRead && "opacity-50 grayscale hover:opacity-80 hover:grayscale-0"
      )}
    >
      <div className="aspect-[2/3] w-full bg-muted">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}
        <button
          onClick={() => deleteBook(book.id)}
          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
          aria-label={`Delete ${book.title}`}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      <div className="p-2.5">
        <p className="truncate text-xs font-medium text-foreground">{book.title}</p>
        <p className="truncate text-[11px] text-muted-foreground">{book.author}</p>
        <Select value={book.status} onValueChange={(v) => updateBookStatus(book.id, v as BookStatus)}>
          <SelectTrigger className="mt-2 h-6 px-1.5 text-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(STATUS_LABELS) as BookStatus[]).map((s) => (
              <SelectItem key={s} value={s} className="text-xs">
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

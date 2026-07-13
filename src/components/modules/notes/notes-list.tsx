"use client";

import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Note } from "@/lib/types";

function snippetFrom(html: string) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 0 ? text : "No content yet";
}

export function NotesList({
  notes,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
}: {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-3">
        <h2 className="text-sm font-semibold text-foreground">Notes</h2>
        <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs" onClick={onCreate}>
          <Plus className="h-3.5 w-3.5" /> New
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {notes.length === 0 ? (
          <p className="p-4 text-center text-xs text-muted-foreground">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <button
              key={note.id}
              onClick={() => onSelect(note.id)}
              className={cn(
                "group flex w-full flex-col items-start gap-0.5 border-b border-border/60 px-3 py-2.5 text-left transition-colors",
                selectedId === note.id ? "bg-primary/10" : "hover:bg-muted/60"
              )}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <p
                  className={cn(
                    "truncate text-sm font-medium",
                    selectedId === note.id ? "text-primary" : "text-foreground"
                  )}
                >
                  {note.title || "Untitled note"}
                </p>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(note.id);
                  }}
                  className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  aria-label={`Delete ${note.title || "Untitled note"}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="w-full truncate text-xs text-muted-foreground">{snippetFrom(note.content)}</p>
              <p className="text-[10px] text-muted-foreground/70">
                {format(new Date(note.updatedAt), "MMM d, yyyy · h:mm a")}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

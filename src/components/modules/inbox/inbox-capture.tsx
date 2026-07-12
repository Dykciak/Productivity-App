"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Brain, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUIStore } from "@/store/ui-store";
import { createInboxNote, convertInboxNoteToTask, deleteInboxNote } from "@/lib/actions/inbox";
import type { InboxNote } from "@/lib/types";
import { cn } from "@/lib/utils";

export function InboxCapture({ notes }: { notes: InboxNote[] }) {
  const isOpen = useUIStore((s) => s.isInboxOpen);
  const toggle = useUIStore((s) => s.toggleInbox);
  const close = useUIStore((s) => s.closeInbox);
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const content = value.trim();
    if (!content) return;
    setValue("");
    startTransition(() => createInboxNote(content));
  }

  return (
    <>
      <Button
        onClick={toggle}
        size="icon"
        className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg sm:right-6 md:bottom-6"
        aria-label="Open brain dump"
      >
        <Brain className="h-6 w-6" />
        {notes.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
            {notes.length}
          </span>
        )}
      </Button>

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-40 flex w-full max-w-sm translate-x-full flex-col border-l border-border bg-card p-5 shadow-xl transition-transform duration-300",
          isOpen && "translate-x-0"
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Brain className="h-4 w-4 text-primary" /> Brain Dump
          </h2>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={close}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="What's on your mind?"
          className="min-h-[90px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
          }}
        />
        <Button className="mt-2 w-full" onClick={handleSave} disabled={isPending || !value.trim()}>
          Save thought
        </Button>

        <div className="mt-5 flex-1 space-y-2 overflow-y-auto no-scrollbar">
          <p className="text-xs font-medium text-muted-foreground">Inbox ({notes.length})</p>
          {notes.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">Inbox zero. Nice.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="group rounded-lg border border-border p-2.5 text-sm">
                <p className="text-foreground">{note.content}</p>
                <div className="mt-1.5 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 px-2 text-xs"
                    onClick={() => convertInboxNoteToTask(note.id)}
                  >
                    To task <ArrowRight className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-destructive"
                    onClick={() => deleteInboxNote(note.id)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

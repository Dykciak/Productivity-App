"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Loader2, NotebookText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotesList } from "@/components/modules/notes/notes-list";
import { RichTextEditor } from "@/components/modules/notes/rich-text-editor";
import { createNote, deleteNote, updateNote } from "@/lib/actions/notes";
import type { Note } from "@/lib/types";

type SaveStatus = "idle" | "saving" | "saved";

export function NotesWorkspace({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedId, setSelectedId] = useState<string | null>(initialNotes[0]?.id ?? null);
  const [title, setTitle] = useState(initialNotes[0]?.title ?? "");
  const [content, setContent] = useState(initialNotes[0]?.content ?? "");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [mobileView, setMobileView] = useState<"list" | "editor">("list");
  const dirtyRef = useRef(false);

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  function selectNote(id: string) {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    dirtyRef.current = false;
    setSelectedId(id);
    setTitle(note.title);
    setContent(note.content);
    setSaveStatus("idle");
    setMobileView("editor");
  }

  async function handleCreate() {
    const note = await createNote();
    setNotes((prev) => [note, ...prev]);
    dirtyRef.current = false;
    setSelectedId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSaveStatus("idle");
    setMobileView("editor");
  }

  async function handleDelete(id: string) {
    await deleteNote(id);
    setNotes((prev) => {
      const remaining = prev.filter((n) => n.id !== id);
      if (id === selectedId) {
        const next = remaining[0] ?? null;
        dirtyRef.current = false;
        setSelectedId(next?.id ?? null);
        setTitle(next?.title ?? "");
        setContent(next?.content ?? "");
        setSaveStatus("idle");
      }
      return remaining;
    });
  }

  useEffect(() => {
    if (!selectedNote || !dirtyRef.current) return;
    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      await updateNote(selectedNote.id, { title, content });
      dirtyRef.current = false;
      setNotes((prev) =>
        prev.map((n) => (n.id === selectedNote.id ? { ...n, title: title.trim() || "Untitled note", content, updatedAt: new Date() } : n))
      );
      setSaveStatus("saved");
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 overflow-hidden rounded-xl border border-border md:h-[75vh] md:grid-cols-[280px_1fr]">
      <div className={mobileView === "list" ? "flex flex-col" : "hidden md:flex md:flex-col md:border-r md:border-border"}>
        <NotesList
          notes={notes}
          selectedId={selectedId}
          onSelect={selectNote}
          onCreate={handleCreate}
          onDelete={handleDelete}
        />
      </div>

      <div className={mobileView === "editor" ? "flex flex-col overflow-hidden" : "hidden md:flex md:flex-col md:overflow-hidden"}>
        {selectedNote ? (
          <>
            <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
              <button
                className="text-muted-foreground md:hidden"
                onClick={() => setMobileView("list")}
                aria-label="Back to notes list"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <Input
                value={title}
                onChange={(e) => {
                  dirtyRef.current = true;
                  setTitle(e.target.value);
                }}
                placeholder="Untitled note"
                className="h-8 flex-1 border-none bg-transparent px-1 text-base font-semibold shadow-none focus-visible:ring-0"
              />
              <div className="flex w-16 shrink-0 items-center justify-end gap-1 text-xs text-muted-foreground">
                {saveStatus === "saving" && (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Saving
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <Check className="h-3 w-3 text-success" /> Saved
                  </>
                )}
              </div>
            </div>
            <RichTextEditor
              key={selectedNote.id}
              content={content}
              onChange={(html) => {
                dirtyRef.current = true;
                setContent(html);
              }}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
            <NotebookText className="h-8 w-8" />
            <p className="text-sm">No note selected. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

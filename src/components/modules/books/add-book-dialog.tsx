"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBook } from "@/lib/actions/books";
import type { BookStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: BookStatus; label: string }[] = [
  { value: "READING", label: "Currently Reading" },
  { value: "WANT_TO_READ", label: "Want to Read" },
  { value: "READ", label: "Read" },
];

export function AddBookDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<BookStatus>("WANT_TO_READ");
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  function reset() {
    setTitle("");
    setAuthor("");
    setStatus("WANT_TO_READ");
    setPreview(null);
    formRef.current?.reset();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createBook(formData);
      reset();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Add book
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a book</DialogTitle>
          <DialogDescription>Track something you&apos;re reading, want to read, or finished.</DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <label className="flex h-28 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-muted text-muted-foreground hover:border-primary/50">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Cover preview" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus className="h-5 w-5" />
              )}
              <input
                type="file"
                name="cover"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <div className="flex-1 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="book-title">Title</Label>
                <Input
                  id="book-title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Project Hail Mary"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="book-author">Author</Label>
                <Input
                  id="book-author"
                  name="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Andy Weir"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as BookStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="status" value={status} />
          </div>

          <Button type="submit" className="w-full" disabled={isPending || !title.trim() || !author.trim()}>
            Add book
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

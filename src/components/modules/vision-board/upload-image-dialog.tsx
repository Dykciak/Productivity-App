"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlus, Upload } from "lucide-react";
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
import { uploadVisionImage } from "@/lib/actions/vision-board";

export function UploadImageDialog() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [hasFile, setHasFile] = useState(false);
  const [caption, setCaption] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setHasFile(!!file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  function reset() {
    setPreview(null);
    setHasFile(false);
    setCaption("");
    formRef.current?.reset();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!hasFile) return;
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await uploadVisionImage(formData);
      reset();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Upload className="h-4 w-4" /> Add image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to your vision board</DialogTitle>
          <DialogDescription>Upload a photo or image to pin to your board.</DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <label className="flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-muted text-muted-foreground hover:border-primary/50">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Upload preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-xs">
                <ImagePlus className="h-6 w-6" />
                Click to choose an image
              </div>
            )}
            <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          <div className="space-y-1.5">
            <Label htmlFor="image-caption">Caption (optional)</Label>
            <Input
              id="image-caption"
              name="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's this about?"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending || !hasFile}>
            Add to board
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

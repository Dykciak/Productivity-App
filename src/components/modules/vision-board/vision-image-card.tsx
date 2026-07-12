"use client";

import { Trash2 } from "lucide-react";
import type { VisionImage } from "@/lib/types";
import { deleteVisionImage } from "@/lib/actions/vision-board";

export function VisionImageCard({ image }: { image: VisionImage }) {
  return (
    <div className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border bg-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.url} alt={image.caption ?? ""} className="block w-full" loading="lazy" />
      <button
        onClick={() => deleteVisionImage(image.id)}
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
        aria-label="Delete image"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
      {image.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100">
          <p className="truncate text-xs font-medium text-white">{image.caption}</p>
        </div>
      )}
    </div>
  );
}

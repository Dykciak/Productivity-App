import type { VisionImage } from "@/lib/types";
import { VisionImageCard } from "@/components/modules/vision-board/vision-image-card";

export function VisionBoard({ images }: { images: VisionImage[] }) {
  if (images.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Your board is empty. Add your first image to get started.
      </p>
    );
  }

  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
      {images.map((image) => (
        <VisionImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}

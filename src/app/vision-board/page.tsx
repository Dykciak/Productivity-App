import { GalleryHorizontalEnd } from "lucide-react";
import { VisionBoard } from "@/components/modules/vision-board/vision-board";
import { UploadImageDialog } from "@/components/modules/vision-board/upload-image-dialog";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function VisionBoardPage() {
  const images = await prisma.visionImage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <GalleryHorizontalEnd className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Vision Board</h1>
            <p className="text-sm text-muted-foreground">Pin the photos and ideas that inspire you.</p>
          </div>
        </div>
        <UploadImageDialog />
      </div>

      <VisionBoard images={images} />
    </main>
  );
}

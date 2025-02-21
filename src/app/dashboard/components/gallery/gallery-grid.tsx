// components/GalleryGrid.tsx
"use client";

import Image from "next/image";
import { deleteGalleryArt } from "@/app/actions/gallery";
import { Button } from "@/components/ui/button";
import { GalleryArt } from "@prisma/client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface GalleryGridProps {
  arts: GalleryArt[];
}

export default function GalleryGrid({ arts }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedArt, setSelectedArt] = useState<{
    id: string;
    img: string;
  } | null>(null);

  const handleDelete = async (artId: string, imagePath: string) => {
    try {
      await deleteGalleryArt(artId, imagePath);
      toast.success("Artwork deleted successfully");
      window.location.reload();
    } catch {
      toast.error("Failed to delete artwork");
    }
  };

  return (
    <div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {arts.map((art) =>
          art.images.map((img, index) => (
            <div
              key={`${art.id}-${index}`}
              className="mb-6 break-inside-avoid group relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  src={img}
                  alt="Artwork"
                  width={600}
                  height={800}
                  className="w-full h-auto cursor-zoom-in"
                  onClick={() => setSelectedImage(img)}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                />

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-full p-2 h-8 w-8 shadow-lg"
                        aria-label="Delete artwork"
                        onClick={() => setSelectedArt({ id: art.id, img })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this artwork? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            selectedArt &&
                            handleDelete(selectedArt.id, selectedArt.img)
                          }
                        >
                          Confirm Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Image
            src={selectedImage}
            alt="Fullscreen view"
            width={2000}
            height={2000}
            className="object-contain max-h-[90vh] rounded-lg shadow-xl"
          />
        </div>
      )}
    </div>
  );
}

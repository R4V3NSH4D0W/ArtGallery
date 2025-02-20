// app/dashboard/gallery/page.tsx
import { getGalleryArts } from "@/app/actions/gallery";
import GalleryUploadForm from "../components/gallery/gallery-upload-form";
import GalleryGrid from "../components/gallery/gallery-grid";

export default async function DashboardPage() {
  const data = await getGalleryArts();

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Gallery Management
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <GalleryUploadForm />
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Current Artworks
          </h2>
          <GalleryGrid arts={data} />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";
import { useRefetch } from "@/context/refetchContext";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
  images: string[];
}

export default function EditProductModal({
  open,
  setOpen,
  product,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product: Product;
}) {
  const [images, setImages] = useState<(File | string)[]>([...product.images]);
  const [quantity, setQuantity] = useState(product.quantity);
  const [category, setCategory] = useState(product.category);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const { setRefetchFlag } = useRefetch();

  useEffect(() => {
    setCategory(product.category);
    setName(product.name);
    setPrice(product.price);
    setQuantity(product.quantity);
    setDescription(product.description);
    setImages([...product.images]);
  }, [product]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setImages((prevImages) => [...prevImages, ...Array.from(files)]);
    }
  };

  const removeImage = (
    event: React.MouseEvent,
    index: number,
    image: string | File
  ) => {
    event.preventDefault();

    if (typeof image === "string") {
      setImages((prev) => prev.filter((img, imgIndex) => imgIndex !== index));
    } else {
      setImages((prev) => prev.filter((img, imgIndex) => imgIndex !== index));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (images.length === 0) {
      toast.error("Please add at least one image for the product.");
      return;
    }

    const formData = new FormData();
    formData.append("id", product.id);
    formData.append("name", name);
    formData.append("price", String(price));
    formData.append("quantity", String(quantity));
    formData.append("description", description);
    formData.append("category", category);

    images.forEach((image) => {
      if (typeof image !== "string") {
        formData.append("images", image);
      }
    });

    const deletedImages = product.images.filter(
      (image) => !images.includes(image) && typeof image === "string"
    );
    deletedImages.forEach((deletedImage) => {
      formData.append("deletedImages", deletedImage);
    });

    try {
      const res = await fetch(`/api/products?id=${product.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update product");
      }
      toast.success("Product updated successfully");
      setRefetchFlag(true);
      setOpen(false);
      setImages([]);
      setQuantity(1);
      setCategory("");
      setName("");
      setPrice(0);
      setDescription("");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Edit Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <Input
                className="rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <Input
                  type="number"
                  className="rounded-lg"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    className="rounded-lg w-9 h-9 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="rounded-lg text-center w-20"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setQuantity(quantity + 1);
                    }}
                    className="rounded-lg w-9 h-9 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                className="rounded-lg min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Category Selection */}
            <section>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg w-full py-2 px-3 border border-gray-300"
              >
                <option value="">Select Category</option>
                {[
                  "Geometry",
                  "Abstract",
                  "Impressionism",
                  "Cubism",
                  "Surrealism",
                  "Expressionism",
                  "Minimalism",
                  "Pop Art",
                ].map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </section>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Product Images
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center transition-colors hover:border-primary/50">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <ImagePlus className="h-8 w-8 text-primary" />
                <div className="text-sm text-gray-600">
                  <span className="text-primary font-medium">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </div>
                <span className="text-xs text-gray-500">
                  PNG, JPG up to 5MB
                </span>
              </label>
              <Input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>

            {images.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-lg overflow-hidden shadow-sm"
                  >
                    <Image
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt={`Image ${index}`}
                      layout="fill"
                      objectFit="cover"
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => removeImage(e, index, image)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No images to display</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-black rounded-lg py-3 font-semibold transition-opacity"
          >
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

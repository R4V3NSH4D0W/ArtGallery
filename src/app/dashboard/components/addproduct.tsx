import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  ImagePlus,
  Trash2,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useRefetch } from "@/context/refetchContext";
import Select from "react-select";

interface Option {
  value: string;
  label: string;
}

export default function AddProductModal() {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState<Option[]>([]);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [breadth, setBreadth] = useState<number>(0);
  const [material, setMaterial] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const { setRefetchFlag } = useRefetch();

  const categories = [
    "Geometry",
    "Abstract",
    "Impressionism",
    "Cubism",
    "Surrealism",
    "Expressionism",
    "Minimalism",
    "Pop Art",
  ];

  const availableMaterials = ["Wood", "Metal", "Plastic", "Glass", "Fabric"];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setImages((prevImages) => [...prevImages, ...Array.from(files)]);
    }
  };

  const removeImage = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (images.length === 0) {
      toast.error("Please add at least one image for the product.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("action", "create-product");
    formData.append("name", name);
    formData.append("price", String(price));
    formData.append("quantity", String(quantity));
    formData.append("description", description);
    formData.append(
      "category",
      JSON.stringify(category.map((cat) => cat.value))
    );
    formData.append("length", String(length));
    formData.append("width", String(width));
    formData.append("breadth", String(breadth));
    formData.append(
      "material",
      JSON.stringify(material.map((mat) => mat.value))
    );

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save product");
      }
      toast.success("Product saved successfully");
      setRefetchFlag(true);
      setOpen(false);
      setImages([]);
      setQuantity(1);
      setCategory([]);
      setName("");
      setPrice(0);
      setDescription("");
      setLength(0);
      setWidth(0);
      setBreadth(0);
      setMaterial([]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error((error as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1 h-8">
          <PlusCircle className="h-3.5 w-3.5" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl rounded-xl p-6 h-[100vh] max-h-[100vh] overflow-y-auto sm:h-auto sm:max-h-none sm:overflow-visible">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Add New Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <Input
                className="rounded-lg w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <Input
                  type="number"
                  className="rounded-lg w-full sm:w-[15rem]"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>

              <div className="flex-1">
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

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length (cm)
                </label>
                <Input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="rounded-lg w-full"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (cm)
                </label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="rounded-lg w-full"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Breadth (cm)
                </label>
                <Input
                  type="number"
                  value={breadth}
                  onChange={(e) => setBreadth(Number(e.target.value))}
                  className="rounded-lg w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                className="rounded-lg w-full min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select
                  isMulti
                  options={categories.map((cat) => ({
                    label: cat,
                    value: cat,
                  }))}
                  value={category}
                  onChange={(newValue) => setCategory(newValue as Option[])}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material
                </label>
                <Select
                  isMulti
                  options={availableMaterials.map((mat) => ({
                    label: mat,
                    value: mat,
                  }))}
                  value={material}
                  onChange={(newValue) => setMaterial(newValue as Option[])}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
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
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {images.length > 0 && (
              <div className="flex gap-2 mt-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`image-${index}`}
                      layout="fill"
                      objectFit="cover"
                    />
                    <button
                      onClick={(e) => removeImage(e, index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="block sm:hidden w-full h-12 mt-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full h-12 mt-6 bg-primary text-white"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Save Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

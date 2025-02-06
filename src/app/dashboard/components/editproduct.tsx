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
import { Trash2, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";
import { useRefetch } from "@/context/refetchContext";
import Select from "react-select";

interface Option {
  value: string;
  label: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string[];
  images: string[];
  dimensions: {
    length: number;
    width: number;
    breadth: number;
  };
  material: string[];
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
  console.log(product);
  const [images, setImages] = useState<(File | string)[]>([...product.images]);
  const [quantity, setQuantity] = useState(product.quantity);
  const [category, setCategory] = useState<Option[]>(
    product.category.map((cat) => ({ value: cat, label: cat }))
  );
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [length, setLength] = useState(product.dimensions.length);
  const [width, setWidth] = useState(product.dimensions.width);
  const [breadth, setBreadth] = useState(product.dimensions.breadth);
  const [material, setMaterial] = useState<Option[]>(
    product.material.map((mat) => ({ value: mat, label: mat }))
  );
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

  useEffect(() => {
    setCategory(product.category.map((cat) => ({ value: cat, label: cat })));
    setMaterial(product.material.map((mat) => ({ value: mat, label: mat })));
    setImages([...product.images]);
    setQuantity(product.quantity);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    if (product.dimensions) {
      setLength(product.dimensions.length || 0);
      setWidth(product.dimensions.width || 0);
      setBreadth(product.dimensions.breadth || 0);
    }
  }, [product]);

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
      setCategory([]);
      setName("");
      setPrice(0);
      setDescription("");
      setLength(0);
      setWidth(0);
      setBreadth(0);
      setMaterial([]);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Edit Product
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

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <Input
                  type="number"
                  className="rounded-lg w-[15rem]"
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

            <div className="flex gap-4">
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
                <span className="text-sm text-gray-600">
                  <span className="text-primary font-medium">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </span>
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
            {images.length > 0 && (
              <div className="flex gap-2 mt-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden"
                  >
                    {typeof image === "string" ? (
                      <Image
                        src={image}
                        alt={`image-${index}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <Image
                        src={URL.createObjectURL(image)}
                        alt={`image-${index}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    )}
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
            type="submit"
            className="w-full h-12 mt-6 bg-primary text-white"
          >
            Save Product
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

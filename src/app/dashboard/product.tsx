"use client";
import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import { useRefetch } from "@/context/refetchContext";
import EditProductModal from "./components/editproduct";
import { getStatusClass } from "@/lib/helper";
import ConfirmationModal from "./components/confirmationModel";
import { ProductResponse } from "@/lib/types";

export function Product({ product }: { product: ProductResponse }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { setRefetchFlag } = useRefetch();

  const handleEditClick = () => {
    setOpen(true);
  };

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          action: "change-status",
          productId: product.id,
          status: newStatus,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Product status updated successfully!");
        setRefetchFlag(true);
      } else {
        toast.error(data.error || "Failed to update product status");
      }
    } catch {
      toast.error("An error occurred while updating the product status");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?productId=${productId}`, {
        credentials: "include",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Product deleted successfully!");
        setRefetchFlag(true);
      } else {
        toast.error(data.error || "Failed to delete product");
      }
    } catch {
      toast.error("An error occurred while deleting the product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  // Close the delete confirmation modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Confirm delete action
  const handleConfirmDelete = () => {
    deleteProduct(product.id);
    setIsDeleteModalOpen(false);
  };
  // src="http://localhost:4000/api/uploads?file=1e6be9d7-d667-44f5-9cef-ed26a6f9b6b5.png"
  return (
    <>
      <TableRow>
        <TableCell className="hidden sm:table-cell">
          <Image
            className="aspect-square rounded-md object-cover"
            src={product.images[0]}
            alt="Product Image"
            width={64}
            height={64}
          />
        </TableCell>
        <TableCell className="font-medium">{product.name}</TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className="capitalize text-white"
            style={{ backgroundColor: getStatusClass(product.status) }}
          >
            {product.status}
          </Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <span className="font-bold">NRS</span>{" "}
          {product.price.toLocaleString()}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {product.quantity}
        </TableCell>

        <TableCell className="hidden md:table-cell">
          {new Date(product.createdAt).toLocaleDateString("en-US")}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {product.category}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEditClick()}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteClick} // Trigger delete confirmation
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </DropdownMenuItem>

              {/* Submenu for Change Status */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => updateStatus("active")}
                    disabled={product.status === "active" || loading}
                  >
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateStatus("inactive")}
                    disabled={product.status === "inactive" || loading}
                  >
                    Inactive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateStatus("archived")}
                    disabled={product.status === "archived" || loading}
                  >
                    Archived
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      <EditProductModal open={open} setOpen={setOpen} product={product} />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

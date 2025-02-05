"use client";

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "./product";
// Define the type for a product
export interface SelectProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
  images: string[];
  createdAt: string;
  status: string;
}

export function ProductsTable({
  products,
  offset,
  totalProducts,
}: {
  products: SelectProduct[];
  offset: number;
  totalProducts: number;
}) {
  const router = useRouter();
  const productsPerPage = 10;

  function prevPage() {
    if (offset > 0) {
      router.push(`/dashboard/?offset=${offset - productsPerPage}`, {
        scroll: false,
      });
    }
  }

  function nextPage() {
    if (offset + productsPerPage < totalProducts) {
      router.push(`/dashboard/?offset=${offset + productsPerPage}`, {
        scroll: false,
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">Qty.</TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {Math.max(0, offset)}-
              {Math.min(offset + productsPerPage - 1, totalProducts)}
            </strong>{" "}
            of <strong>{totalProducts}</strong> products
          </div>
          <div className="flex">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={prevPage}
              disabled={offset <= 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={nextPage}
              disabled={offset + productsPerPage >= totalProducts}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}

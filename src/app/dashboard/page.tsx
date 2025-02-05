"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File } from "lucide-react";
import AddProductModal from "./components/addproduct";
import { ProductsTable, SelectProduct } from "./product-table";
import { useRefetch } from "@/context/refetchContext";
import { BeatLoader } from "react-spinners"; // Import the spinner component

async function getProducts(search: string, offset: number, status: string) {
  const response = await fetch(
    `/api/products?q=${search}&offset=${offset}&status=${status}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return await response.json();
}

export default function DashBoard(props: {
  searchParams: Promise<{ q: string; offset: string }>;
}) {
  const [products, setProducts] = useState<SelectProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [newOffset, setNewOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refetchFlag, setRefetchFlag } = useRefetch();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const searchParams = await props.searchParams;
        const search = searchParams.q ?? "";
        const offset = parseInt(searchParams.offset ?? "0", 10);

        const data = await getProducts(search, offset, activeTab);
        setProducts(data.products);
        setTotalProducts(data.totalProducts);
        setNewOffset(data.newOffset ?? 0);
        setLoading(false);
      } catch {
        setError("Failed to load products");
        setLoading(false);
      }
    }
    if (refetchFlag) {
      fetchProducts();
      setRefetchFlag(false);
    } else {
      fetchProducts();
    }
  }, [props.searchParams, refetchFlag, setRefetchFlag, activeTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <BeatLoader size={15} color="black" loading={loading} />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Tabs defaultValue="all" onValueChange={setActiveTab}>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>

          {/* Add Product Modal */}
          <AddProductModal />
        </div>
      </div>

      {/* Conditional rendering for tab-based product filtering */}
      <TabsContent value="all">
        <ProductsTable
          products={products}
          offset={newOffset}
          totalProducts={totalProducts}
        />
      </TabsContent>
      <TabsContent value="active">
        <ProductsTable
          products={products}
          offset={newOffset}
          totalProducts={totalProducts}
        />
      </TabsContent>
      <TabsContent value="inactive">
        <ProductsTable
          products={products}
          offset={newOffset}
          totalProducts={totalProducts}
        />
      </TabsContent>
      <TabsContent value="draft">
        <ProductsTable
          products={products}
          offset={newOffset}
          totalProducts={totalProducts}
        />
      </TabsContent>
      <TabsContent value="archived">
        <ProductsTable
          products={products}
          offset={newOffset}
          totalProducts={totalProducts}
        />
      </TabsContent>
    </Tabs>
  );
}

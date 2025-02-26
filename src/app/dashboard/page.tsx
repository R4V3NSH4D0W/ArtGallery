"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File } from "lucide-react";
import AddProductModal from "./components/addproduct";
import { ProductsTable } from "./product-table";
import { useRefetch } from "@/context/refetchContext";
import { BeatLoader } from "react-spinners";
import { IProduct } from "@/lib/types";

async function getProducts(
  search: string,
  offset: number,
  status: string,
  limit: number
) {
  const response = await fetch(
    `/api/products?q=${search}&offset=${offset}&limit=${limit}&status=${status}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return await response.json();
}

function DashBoard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const offsetParam = searchParams.get("offset") ?? "0";
  const limitParam = searchParams.get("limit") ?? "10";
  const statusParam = searchParams.get("status") ?? "all";

  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [offset, setOffset] = useState(parseInt(offsetParam, 10));
  const [limit, setLimit] = useState(parseInt(limitParam, 10));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refetchFlag, setRefetchFlag } = useRefetch();
  const [activeTab, setActiveTab] = useState(statusParam);

  const handleTabChange = (tab: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("status", tab);
    newSearchParams.set("offset", "0");
    router.push(`/dashboard?${newSearchParams.toString()}`);
    setActiveTab(tab);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const initialOffset = parseInt(offsetParam, 10);
        const initialLimit = parseInt(limitParam, 10);
        setOffset(initialOffset);
        setLimit(initialLimit);

        const data = await getProducts(
          q,
          initialOffset,
          activeTab,
          initialLimit
        );
        setProducts(data.products);
        setTotalProducts(data.totalProducts);
        setLoading(false);
      } catch {
        setError("Failed to load products");
        setLoading(false);
        setRefetchFlag(false);
      }
    }
    if (refetchFlag) {
      fetchProducts();
      setRefetchFlag(false);
    } else {
      fetchProducts();
    }
  }, [q, offsetParam, limitParam, refetchFlag, setRefetchFlag, activeTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BeatLoader size={15} color="black" loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            {/* <TabsTrigger value="draft">Draft</TabsTrigger> */}
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
            <AddProductModal />
          </div>
        </div>

        <TabsContent value="all">
          <ProductsTable
            products={products}
            offset={offset}
            totalProducts={totalProducts}
            limit={limit}
          />
        </TabsContent>
        <TabsContent value="active">
          <ProductsTable
            products={products}
            offset={offset}
            totalProducts={totalProducts}
            limit={limit}
          />
        </TabsContent>
        <TabsContent value="inactive">
          <ProductsTable
            products={products}
            offset={offset}
            totalProducts={totalProducts}
            limit={limit}
          />
        </TabsContent>
        <TabsContent value="draft">
          <ProductsTable
            products={products}
            offset={offset}
            totalProducts={totalProducts}
            limit={limit}
          />
        </TabsContent>
        <TabsContent value="archived">
          <ProductsTable
            products={products}
            offset={offset}
            totalProducts={totalProducts}
            limit={limit}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <BeatLoader size={15} color="black" />
        </div>
      }
    >
      <DashBoard />
    </Suspense>
  );
}

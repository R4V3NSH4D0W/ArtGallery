"use client";

import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";

export default function OrderSuccessScreen() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user, loading } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (!user && !loading) {
      router.push("/signin");
      return;
    }
  }, [user, loading, router]);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4 animate-fade-in">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto animate-bounce" />
          <h1 className="text-4xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Your order #{orderId} has been successfully placed
          </p>
          {user?.email && (
            <p className="text-gray-500">
              A confirmation email has been sent to {user?.email}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
          <Button asChild className="gap-2 h-14 text-lg">
            <Link href="/profile">
              <Package className="h-5 w-5" />
              View Orders
            </Link>
          </Button>
          <Button asChild variant="secondary" className="gap-2 h-14 text-lg">
            <Link href="/shop">
              <ShoppingBag className="h-5 w-5" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

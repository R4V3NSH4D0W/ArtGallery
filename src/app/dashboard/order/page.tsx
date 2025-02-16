"use client";

import { useEffect, useState } from "react";
import { OrderTable } from "../components/order-table";
import { IOrderWithRelations } from "@/lib/types";
import { getOrders } from "@/app/actions/order-action";
import { toast } from "react-toastify";

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrderWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();

        setOrders(response);
      } catch {
        toast.error("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Order Management</h1>
      <OrderTable data={orders} />
    </div>
  );
}

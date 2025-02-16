import { getOrders } from "@/app/actions/order-action";
import { OrderTable } from "../components/order-table";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Order Management</h1>
      <OrderTable data={orders} />
    </div>
  );
}

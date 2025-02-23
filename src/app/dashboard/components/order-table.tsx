"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderStatus } from "@prisma/client";
import { DataTableColumnHeader } from "./data-table-header";
import { updateOrderStatus } from "@/app/actions/order-action";
import { DataTable } from "./data-table";
import { toast } from "react-toastify";
import { IOrderWithRelations } from "@/lib/types";

const columns: ColumnDef<IOrderWithRelations>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "user.name",
    header: "Customer",
  },
  {
    accessorKey: "userAddress",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.userAddress;
      return address ? (
        <div className="max-w-[200px]">
          {address.address}, {address.city} {address.postalCode}
        </div>
      ) : (
        <Badge variant="destructive">No Address</Badge>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      return <div>NRS {amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = {
        PENDING: "secondary",
        NOTICED: "outline",
        WORKING: "default",
        DELIVERED: "default",
        CANCELLED: "destructive",
      }[status] as "default" | "destructive" | "outline" | "secondary";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      const handleStatusUpdate = async (
        newStatus: OrderStatus,
        e: React.MouseEvent
      ) => {
        e.stopPropagation();
        try {
          await updateOrderStatus(order.id, newStatus);
          toast.success("Order status updated");
        } catch {
          toast.error("Failed to update status");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => handleStatusUpdate("PENDING", e)}>
              Mark as Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handleStatusUpdate("NOTICED", e)}>
              Mark as Noticed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handleStatusUpdate("WORKING", e)}>
              Mark as Working
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => handleStatusUpdate("READYTOSHIP", e)}
            >
              Mark as Ready to Ship
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handleStatusUpdate("SHIPPED", e)}>
              Mark as Shipped
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => handleStatusUpdate("DELIVERED", e)}
            >
              Mark as Delivered
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => handleStatusUpdate("CANCELLED", e)}
              className="text-red-600 focus:bg-red-50"
            >
              Mark as Cancelled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function OrderTable({ data }: { data: IOrderWithRelations[] }) {
  return (
    <DataTable columns={columns} data={data} placeholder="Search orders..." />
  );
}

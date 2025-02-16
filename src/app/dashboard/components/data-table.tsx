"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { OrderWithRelations } from "@/app/actions/order-action";

const fuzzyFilter: FilterFn<OrderWithRelations> = (row, _, value) => {
  const order = row.original;
  const searchTerm = value.toLowerCase();

  return (
    order.user.name.toLowerCase().includes(searchTerm) ||
    order.id.toLowerCase().includes(searchTerm) ||
    order.orderItems.some((item) =>
      item.product.name.toLowerCase().includes(searchTerm)
    )
  );
};

interface DataTableProps {
  columns: ColumnDef<OrderWithRelations>[];
  data: OrderWithRelations[];
  placeholder?: string;
}

export function DataTable({
  columns,
  data,
  placeholder = "Search orders...",
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithRelations | null>(
    null
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder={placeholder}
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Customer Information</h3>
                  <p className="text-sm">{selectedOrder.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.user.email}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Shipping Address</h3>
                  {selectedOrder.userAddress ? (
                    <>
                      <p className="text-sm">
                        {selectedOrder.userAddress.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.userAddress.city},{" "}
                        {selectedOrder.userAddress.postalCode}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.userAddress.phoneNumber}
                      </p>
                    </>
                  ) : (
                    <Badge variant="destructive">No Address Provided</Badge>
                  )}
                </div>
              </div>

              <div className="border rounded-lg">
                <div className="p-4 bg-muted/50">
                  <h3 className="font-medium">Products Ordered</h3>
                </div>
                <div className="p-4 space-y-4">
                  {selectedOrder.orderItems.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      {item.product.images?.length > 0 && (
                        <div className="relative w-20 h-20">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="rounded-md object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.product.description}
                        </p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-sm">
                            Quantity: {item.quantity}
                          </span>
                          <span className="text-sm">
                            Price: NRS {item.product.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">Order Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedOrder.createdAt), "PPp")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Total Amount</p>
                  <p className="font-medium text-lg">
                    NRS {selectedOrder.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => setSelectedOrder(row.original)}
                  className="cursor-pointer hover:bg-muted/50"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

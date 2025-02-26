"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface PaymentConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function PaymentConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
}: PaymentConfirmationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Payment Method</DialogTitle>
          <DialogDescription>
            Currently accepting Cash on Delivery only
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              For payment questions, contact support at
              <br />
              <a
                href={`mailto:${process.env.EMAIL_USER}`}
                className="font-medium"
              >
                artgallery.bishalkhadgi@gmail.com
              </a>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Confirm Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { createUserAddress, getUserAddress } from "@/app/actions/address";
import { checkoutAction } from "@/app/actions/checkout";
import { toast } from "react-toastify";

import { PaymentConfirmationModal } from "@/components/checkout/payment-conformation-model";
import { OrderSuccessScreen } from "@/components/checkout/order-success-model";

export default function CheckoutPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  const [formData, setFormData] = useState({
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<{
    show: boolean;
    orderId?: string;
  }>({ show: false });
  const [addressId, setAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/signin");
      return;
    }

    const loadUserAddress = async () => {
      if (!user) return; // Ensure user is not null

      try {
        const address = await getUserAddress(user.id);
        if (address) {
          setFormData({
            phoneNumber: address.phoneNumber,
            address: address.address,
            city: address.city,
            postalCode: address.postalCode,
          });
        }
      } catch {
        toast.error("Failed to load address");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserAddress();
  }, [user, router, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = Object.values(formData);
    if (requiredFields.some((field) => !field.trim())) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    setIsSubmitting(true);

    try {
      const addressResult = await createUserAddress(
        user.id,
        formData.phoneNumber,
        formData.address,
        formData.city,
        formData.postalCode
      );

      if (!addressResult.success || !addressResult.addressId) {
        throw new Error("Address update failed");
      }

      setShowPaymentModal(true);
      setAddressId(addressResult.addressId);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Form submission failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentConfirmation = async () => {
    if (!user || !addressId) return;

    try {
      const result = await checkoutAction(user.id, addressId, user.email);

      if (result.success) {
        setOrderSuccessData({ show: true, orderId: result.orderId });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (orderSuccessData.show) {
    return (
      <OrderSuccessScreen
        orderId={orderSuccessData.orderId}
        email={user?.email}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-[4rem]">
      <PaymentConfirmationModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        onConfirm={handlePaymentConfirmation}
      />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
        >
          <div className="space-y-8">
            {/* Contact Information */}

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300"
                    value={user?.name || ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300"
                    value={user?.email || ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </section>
            {/* Shipping Address */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-md font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Continue to Payment"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

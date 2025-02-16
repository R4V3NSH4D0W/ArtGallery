/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PaymentConfirmationModal } from "@/components/checkout/payment-conformation-model";
import { createUserAddress, getUserAddress } from "@/app/actions/address";
import { toast } from "react-toastify";
import { buyNowAction } from "@/app/actions/buy-now";
import { getProduct } from "@/app/actions/get-product";
import { Product } from "@prisma/client";

export default function BuyNowCheckoutPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const params = useParams<{ ids: string[] }>();
  const [productId, quantity] = params.ids || [];

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
  const [productDetails, setProductDetails] = useState<Product | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/signin");
      return;
    }

    const loadData = async () => {
      try {
        if (!user || !productId) return;

        const productRes = await getProduct(productId);
        if (!productRes.success) throw new Error("Product not found");

        setProductDetails(productRes.product as Product);

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
        toast.error("Failed to load required data");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, productId, loading, router]);

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
    if (!user || !productDetails || !validateForm()) return;

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
    if (!user || !addressId || !productDetails) return;

    try {
      const result = await buyNowAction(
        user.id,
        productDetails.id,
        Number(quantity),
        addressId,
        user.email
      );

      if (result.success) {
        setOrderSuccessData({ show: true, orderId: result.orderId });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    }
  };

  useEffect(() => {
    if (orderSuccessData.show) {
      router.push(`/checkout/ordersuccess/${orderSuccessData.orderId}`);
    }
  }, [orderSuccessData, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Instant Checkout
          </h1>
          <p className="text-gray-600">Complete your direct purchase</p>
        </div>

        {productDetails && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="relative md:w-1/3">
                <img
                  src={productDetails.images[0]}
                  alt={productDetails.name}
                  className="w-full h-48 md:h-56 object-cover rounded-xl shadow-sm border border-gray-200"
                />
                <span className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  Qty: {quantity}
                </span>
              </div>

              {/* Product Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {productDetails.name}
                  </h2>
                  {productDetails.description && (
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {productDetails.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">Unit Price</span>
                    <p className="text-md font-semibold text-blue-600">
                      NRS {productDetails.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">Quantity</span>
                    <p className="text-md font-semibold text-gray-900">
                      × {quantity}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">
                      Total
                    </span>
                    <p className="text-lg font-bold text-blue-600">
                      NRS{" "}
                      {(
                        productDetails.price * Number(quantity)
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleFormSubmit}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
        >
          <div className="space-y-8">
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

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-md font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Confirm Purchase"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

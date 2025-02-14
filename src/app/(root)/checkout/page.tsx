"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  createUserAddress,
  getUserAddress,
  updateUserAddress,
} from "@/app/actions/address";
import { checkoutAction } from "@/app/actions/checkout";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const { user } = useAuthContext();
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchAddress = async () => {
      const userAddress = await getUserAddress(user.id);
      if (userAddress) {
        setPhoneNumber(userAddress.phoneNumber);
        setAddress(userAddress.address);
        setCity(userAddress.city);
        setPostalCode(userAddress.postalCode);
      }
    };

    fetchAddress();
  }, [user]);

  const handleCheckout = async () => {
    if (!user) return;

    setLoading(true);

    const userAddress = await getUserAddress(user.id);
    let addressId = userAddress?.id;

    if (!userAddress) {
      const newAddress = await createUserAddress(
        user.id,
        phoneNumber,
        address,
        city,
        postalCode
      );
      if (!newAddress.success) {
        alert("Failed to save address");
        setLoading(false);
        return;
      }
      addressId = newAddress.addressId;
    } else {
      const updatedAddress = await updateUserAddress(
        user.id,
        phoneNumber,
        address,
        city,
        postalCode
      );
      if (!updatedAddress.success) {
        toast.error("Failed to update address");
        setLoading(false);
        return;
      }
      addressId = updatedAddress.addressId;
    }
    setLoading(false);

    if (!addressId) {
      toast.error("Address ID is missing");
      setLoading(false);
      return;
    }
    const result = await checkoutAction(user.id, addressId, user.email);
    setLoading(false);
    console.log(result);

    if (result.success) {
      router.push(`/checkout/${result.orderId}`);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-[3.5rem]">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={user?.name || ""}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={user?.email || ""}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">
              Shipping Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <Button
            className="w-full h-10 lg:h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-md lg:text-lg font-semibold rounded-lg transition-transform hover:scale-[1.01]"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                Processing...
              </div>
            ) : (
              "Confirm Order"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserProfile, updateUserProfile } from "@/app/actions/user";
import { getOrders } from "@/app/actions/order";
import { useAuthContext } from "@/context/AuthContext";
import { Order, Profile } from "@/lib/types";

export default function ProfilePage() {
  const { user } = useAuthContext();

  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const [profileData, ordersData] = await Promise.all([
          getUserProfile(user.id),
          getOrders(user.id),
        ]);

        if (profileData) {
          setProfile({
            name: profileData.name,
            email: profileData.email,
            phoneNumber: profileData.address?.phoneNumber || "",
            address: profileData.address?.address || "",
            city: profileData.address?.city || "",
            postalCode: profileData.address?.postalCode || "",
          });
        }

        if (ordersData) {
          const formattedOrders = ordersData.map((order) => ({
            ...order,
            createdAt: order.createdAt.toLocaleDateString(),
          }));
          setOrders(formattedOrders);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (user) {
      await updateUserProfile(user.id, profile);
    }
    setEditMode(false);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-[5rem]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <Button
              onClick={() => setEditMode(!editMode)}
              variant={editMode ? "secondary" : "outline"}
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                disabled={!editMode}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 cursor-not-allowed"
                value={profile.email}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                value={profile.phoneNumber}
                onChange={(e) =>
                  setProfile({ ...profile, phoneNumber: e.target.value })
                }
                disabled={!editMode}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                disabled={!editMode}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                value={profile.city}
                onChange={(e) =>
                  setProfile({ ...profile, city: e.target.value })
                }
                disabled={!editMode}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                value={profile.postalCode}
                onChange={(e) =>
                  setProfile({ ...profile, postalCode: e.target.value })
                }
                disabled={!editMode}
              />
            </div>

            {editMode && (
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Order History
          </h2>

          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-6 ">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg h-[2.3rem] text-sm font-medium ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "WORKING"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-medium">
                      NPR {order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Shipping Address</p>
                    <p className="font-medium">
                      {order.userAddress?.address}, {order.userAddress?.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-medium">
                      {order.userAddress?.phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold mb-2">Items:</h3>
                  <div className="space-y-2">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden">
                          {item.product.images[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="object-cover h-full w-full"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} × NPR {item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

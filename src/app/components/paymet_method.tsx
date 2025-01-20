import Image from "next/image";
import React from "react";

const PaymentMethods = [
  {
    id: 1,
    type: "Credit/Debit Card",
    image: "https://w.wallhaven.cc/full/1p/wallhaven-1p6w3v.jpg",
    description: "Visa, MasterCard, American Express",
  },
  {
    id: 2,
    type: "PayPal",
    image: "https://w.wallhaven.cc/full/we/wallhaven-wezvyp.jpg",
    description: "Secure online payments with PayPal",
  },
  {
    id: 3,
    type: "Bank Transfer",
    image: "https://w.wallhaven.cc/full/1p/wallhaven-1p6vo9.jpg",
    description: "Direct bank-to-bank transactions",
  },
];

function PaymentMethod() {
  return (
    <section className="bg-white flex flex-col py-10">
      <div className="px-4 md:px-[13rem] flex flex-col">
        <label className="text-2xl font-medium">Accepted Payment Methods</label>
        <label className="text-slate-500 text-lg mt-2">
          We offer a variety of secure payment options for your convenience.
        </label>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 mx-4 md:mx-[13rem] mt-10">
        <table className="min-w-full border-collapse bg-white">
          <thead className="border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Payment Method
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {PaymentMethods.map((method, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-2 flex items-center space-x-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image src={method.image} alt={method.type} fill />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {method.type}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {method.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default PaymentMethod;

import React from "react";

const PricingTable = () => {
  const plans = [
    {
      title: "Basic Collection",
      price: "$150",
      features: ["Handcrafted Designs", "Unique Patterns"],
      unavailable: ["Limited Editions", "Custom Requests"],
    },
    {
      title: "Premium Collection",
      price: "$300",
      features: ["Handcrafted Designs", "Unique Patterns", "Limited Editions"],
      unavailable: ["Custom Requests"],
    },
    {
      title: "Exclusive Collection",
      price: "$500",
      features: [
        "Handcrafted Designs",
        "Unique Patterns",
        "Limited Editions",
        "Custom Requests",
      ],
      unavailable: [],
    },
  ];

  return (
    <div className="bg-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Pricing Plans
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transform transition duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {plan.title}
                </h3>
                <p className="text-2xl font-bold text-blue-500 mb-4">
                  {plan.price}
                </p>
                <ul className="mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center mb-2">
                      <span className="text-blue-500 mr-2">✔️</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                  {plan.unavailable.map((feature, i) => (
                    <li key={i} className="flex items-center mb-2">
                      <span className="text-red-500 mr-2">❌</span>
                      <span className="text-gray-400 line-through">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-100 p-4 text-center">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingTable;

import React from "react";

const StatCards = ({ stats }) => {
  const cards = [
    {
      title: "Pending Orders",
      value: stats?.pendingOrders || 0,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Low Stock Products",
      value: stats?.lowStockProducts || 0,
      color: "bg-red-100 text-red-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-soft p-6">
          <p className="text-gray-600 text-sm mb-2">{card.title}</p>
          <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatCards;

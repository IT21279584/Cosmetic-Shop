import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../../components/admin/Sidebar";
import OrderList from "../../components/admin/orders/OrderList";
import OrderDetail from "../../components/admin/orders/OrderDetail";

const AdminOrders = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 w-full lg:ml-72">
        <div className="w-full p-4 pt-20 lg:p-8 lg:pt-8">
          <Routes>
            <Route path="/" element={<OrderList />} />
            <Route path="/:id" element={<OrderDetail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

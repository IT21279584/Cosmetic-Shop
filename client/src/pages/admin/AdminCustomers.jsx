import React from "react";
import AdminSidebar from "../../components/admin/Sidebar";
import CustomerList from "../../components/admin/customers/CustomerList";
import { Routes, Route } from "react-router-dom";

const AdminCustomers = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 w-full lg:ml-72">
        <div className="w-full p-4 pt-20 lg:p-8 lg:pt-8">
          <Routes>
            <Route path="/" element={<CustomerList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;

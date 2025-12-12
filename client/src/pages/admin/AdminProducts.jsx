import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../../components/admin/Sidebar";
import ProductList from "../../components/admin/products/ProductList";
import AddProduct from "../../components/admin/products/AddProduct";
import EditProduct from "../../components/admin/products/EditProduct";

const AdminProducts = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 w-full lg:ml-72">
        <div className="w-full p-4 pt-20 lg:p-8 lg:pt-8">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/edit/:id" element={<EditProduct />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
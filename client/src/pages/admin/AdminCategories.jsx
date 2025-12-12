import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../../components/admin/Sidebar";
import CategoryList from "../../components/admin/category/CategoryList";
import AddCategory from "../../components/admin/category/AddCategory";

const AdminCategories = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 w-full lg:ml-72">
        <div className="w-full p-4 pt-20 lg:p-8 lg:pt-8">
          <Routes>
            <Route path="/" element={<CategoryList />} />
            <Route path="/add" element={<AddCategory />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
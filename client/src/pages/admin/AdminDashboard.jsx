import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Dashboard from '../../components/admin/Dashboard';
import AdminSidebar from '../../components/admin/Sidebar';
import { FaShoppingBag, FaBox, FaUsers, FaChartLine } from 'react-icons/fa';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 w-full lg:ml-72">
        <div className="w-full p-4 pt-20 lg:p-8 lg:pt-8">
          {/* Stats Cards */}
          <Dashboard stats={stats} />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-4">
            <Link
              to="/admin/products/add"
              className="p-6 text-center transition-shadow bg-white rounded-xl shadow-soft hover:shadow-lg"
            >
              <FaBox className="mx-auto mb-3 text-primary-600" size={32} />
              <p className="font-semibold text-gray-900">Add Product</p>
            </Link>

            <Link
              to="/admin/orders"
              className="p-6 text-center transition-shadow bg-white rounded-xl shadow-soft hover:shadow-lg"
            >
              <FaShoppingBag className="mx-auto mb-3 text-blue-600" size={32} />
              <p className="font-semibold text-gray-900">View Orders</p>
            </Link>

            <Link
              to="/admin/customers"
              className="p-6 text-center transition-shadow bg-white rounded-xl shadow-soft hover:shadow-lg"
            >
              <FaUsers className="mx-auto mb-3 text-green-600" size={32} />
              <p className="font-semibold text-gray-900">View Customers</p>
            </Link>

            <Link
              to="/admin/products"
              className="p-6 text-center transition-shadow bg-white rounded-xl shadow-soft hover:shadow-lg"
            >
              <FaChartLine className="mx-auto mb-3 text-purple-600" size={32} />
              <p className="font-semibold text-gray-900">Manage Products</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

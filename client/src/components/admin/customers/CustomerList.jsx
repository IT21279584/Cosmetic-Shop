import React, { useState, useEffect } from "react";
import adminService from "../../../services/adminService";
import { formatDate } from "../../../utils/helpers";
import { FaUsers, FaSearch, FaShieldAlt, FaUser } from "react-icons/fa";
import Loader from "../../common/Loader";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setCustomers(data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader fullScreen />;

  return (
    <div className="w-full max-w-full">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Header Section - Fully Responsive */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
                Customers
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                View and manage customer accounts
              </p>
            </div>
            <div className="flex items-center px-3 py-2 space-x-2 border border-gray-200 rounded-lg sm:px-4 bg-gray-50 sm:rounded-xl">
              <FaUsers className="w-3 h-3 text-gray-400 sm:w-4 sm:h-4" />
              <span className="text-xs font-medium text-gray-700 sm:text-sm">
                {customers.length} Total
              </span>
            </div>
          </div>

          {/* Search Bar - Responsive */}
          <div className="relative">
            <FaSearch className="absolute w-3 h-3 text-gray-400 transform -translate-y-1/2 sm:w-4 sm:h-4 left-3 sm:left-4 top-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 pl-9 pr-3 text-sm sm:py-3 sm:pl-12 sm:pr-4 sm:text-base transition-all bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Customers Table/Cards - Responsive */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase lg:px-6 lg:py-4">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase lg:px-6 lg:py-4">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase lg:px-6 lg:py-4">
                      Role
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase lg:px-6 lg:py-4">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-12 text-center lg:px-6 lg:py-16"
                      >
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full sm:w-16 sm:h-16 bg-gray-50">
                            <FaUsers className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 sm:text-base">
                              No customers found
                            </p>
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                              {searchTerm
                                ? "Try adjusting your search"
                                : "No customers registered yet"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr
                        key={customer._id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 lg:px-6 lg:py-4">
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-white rounded-full lg:w-10 lg:h-10 bg-gradient-to-br from-primary-500 to-primary-600">
                              <span className="text-xs font-semibold lg:text-sm">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 lg:text-base">
                                {customer.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 lg:px-6 lg:py-4">
                          <span className="text-xs text-gray-700 lg:text-sm">
                            {customer.email}
                          </span>
                        </td>
                        <td className="px-4 py-3 lg:px-6 lg:py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full lg:px-3 lg:text-sm ${
                              customer.role === "admin"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            {customer.role === "admin" ? (
                              <FaShieldAlt className="mr-1 lg:mr-1.5" size={10} />
                            ) : (
                              <FaUser className="mr-1 lg:mr-1.5" size={10} />
                            )}
                            {customer.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 lg:px-6 lg:py-4">
                          <span className="text-xs text-gray-600 lg:text-sm">
                            {formatDate(customer.createdAt)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View - Enhanced Responsive */}
            <div className="md:hidden">
              {filteredCustomers.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-3 py-12 space-y-3 sm:px-4 sm:py-16">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full sm:w-16 sm:h-16 bg-gray-50">
                    <FaUsers className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 sm:text-base">
                      No customers found
                    </p>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      {searchTerm
                        ? "Try adjusting your search"
                        : "No customers registered yet"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer._id}
                      className="p-3 transition-colors sm:p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-start space-x-2.5 sm:space-x-3">
                        {/* Avatar - Responsive */}
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white rounded-full sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600">
                          <span className="text-sm font-semibold sm:text-base">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        {/* Customer Details - Responsive */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 truncate sm:text-base">
                                {customer.name}
                              </h3>
                              <p className="text-xs text-gray-500 truncate sm:text-sm">
                                {customer.email}
                              </p>
                            </div>
                            <span
                              className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full sm:px-2.5 sm:py-1 ${
                                customer.role === "admin"
                                  ? "bg-purple-50 text-purple-700"
                                  : "bg-green-50 text-green-700"
                              }`}
                            >
                              {customer.role === "admin" ? (
                                <FaShieldAlt className="mr-1" size={9} />
                              ) : (
                                <FaUser className="mr-1" size={9} />
                              )}
                              {customer.role}
                            </span>
                          </div>
                          <p className="mt-1.5 sm:mt-2 text-xs text-gray-500">
                            Joined {formatDate(customer.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats Footer - Fully Responsive */}
          {filteredCustomers.length > 0 && (
            <div className="flex flex-col gap-2 p-3 bg-white border border-gray-200 rounded-lg sm:flex-row sm:items-center sm:justify-between sm:p-4 sm:rounded-xl">
              <p className="text-xs text-gray-600 sm:text-sm">
                Showing{" "}
                <span className="font-semibold">{filteredCustomers.length}</span>{" "}
                of <span className="font-semibold">{customers.length}</span>{" "}
                customers
              </p>
              <div className="flex gap-3 text-xs sm:gap-4 sm:text-sm">
                <span className="text-gray-600">
                  Admins:{" "}
                  <span className="font-semibold text-purple-600">
                    {customers.filter((c) => c.role === "admin").length}
                  </span>
                </span>
                <span className="text-gray-600">
                  Users:{" "}
                  <span className="font-semibold text-green-600">
                    {customers.filter((c) => c.role === "user").length}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default CustomerList;
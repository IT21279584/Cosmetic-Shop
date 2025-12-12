import React, { useState, useEffect } from "react";
import userService from "../../services/userService";
import useAuth from "../../hooks/useAuth";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const AddressBook = () => {
  const { user, updateUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    isDefault: false,
  });

  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      isDefault: false,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingAddress) {
        const response = await userService.updateAddress(
          editingAddress._id,
          formData
        );
        updateUser(response.data);
        toast.success("Address updated successfully!");
      } else {
        const response = await userService.addAddress(formData);
        updateUser(response.data);
        toast.success("Address added successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  const handleDelete = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const response = await userService.deleteAddress(addressId);
        updateUser(response.data);
        toast.success("Address deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete address");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Address Book</h2>
        <Button onClick={handleAddNew} icon={<FaPlus />}>
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No addresses saved yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address._id} className="border rounded-lg p-4 relative">
              {address.isDefault && (
                <span className="absolute top-4 right-4 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                  Default
                </span>
              )}
              <p className="font-semibold mb-2">{address.fullName}</p>
              <p className="text-sm text-gray-600 mb-4">
                {address.addressLine1}
                <br />
                {address.addressLine2 && (
                  <>
                    {address.addressLine2}
                    <br />
                  </>
                )}
                {address.city}, {address.state} {address.zipCode}
                <br />
                {address.country}
                <br />
                {address.phone}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(address)}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  <FaEdit className="inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  <FaTrash className="inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAddress ? "Edit Address" : "Add New Address"}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Address Line 1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            required
          />

          <Input
            label="Address Line 2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ZIP Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">Set as default address</span>
          </label>

          <Button type="submit" fullWidth>
            {editingAddress ? "Update Address" : "Add Address"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AddressBook;

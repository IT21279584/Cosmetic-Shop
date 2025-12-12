import React from "react";
import { FaShoppingBag, FaCreditCard, FaCheckCircle } from "react-icons/fa";

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Shipping", icon: FaShoppingBag },
    { number: 2, label: "Payment", icon: FaCreditCard },
    { number: 3, label: "Complete", icon: FaCheckCircle },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                currentStep >= step.number
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              <step.icon size={20} />
            </div>
            <span
              className={`text-sm mt-2 ${
                currentStep >= step.number
                  ? "text-primary-600 font-medium"
                  : "text-gray-600"
              }`}
            >
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`w-24 h-1 mx-4 ${
                currentStep > step.number ? "bg-primary-600" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;

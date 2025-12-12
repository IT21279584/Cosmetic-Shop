import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

const ImageGallery = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="relative">
        {/* Main Image */}
        <div
          className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in"
          onClick={() => setIsFullscreen(true)}
        >
          <img
            src={images[currentIndex]?.url}
            alt={`${productName} - ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
            >
              <FaChevronRight />
            </button>
          </>
        )}

        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                currentIndex === idx
                  ? "border-primary-600 ring-2 ring-primary-200"
                  : "border-gray-200 hover:border-primary-300"
              }`}
            >
              <img
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
          >
            <FaTimes size={24} />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 text-white hover:text-gray-300 p-4"
          >
            <FaChevronLeft size={32} />
          </button>

          <img
            src={images[currentIndex]?.url}
            alt={productName}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          <button
            onClick={goToNext}
            className="absolute right-4 text-white hover:text-gray-300 p-4"
          >
            <FaChevronRight size={32} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;

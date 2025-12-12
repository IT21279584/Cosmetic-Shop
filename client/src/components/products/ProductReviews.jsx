import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaThumbsUp,
  FaFlag,
  FaUserCircle,
  FaCheckCircle,
  FaImage,
  FaVideo,
  FaFilter,
} from "react-icons/fa";
import productService from "../../services/productService";
import useAuth from "../../hooks/useAuth";
import { formatDate } from "../../utils/helpers";
import Button from "../common/Button";
import { toast } from "react-toastify";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("helpful");
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const data = await productService.getProductReviews(productId);
      setReviews(data.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to write a review");
      return;
    }

    setSubmitting(true);
    try {
      await productService.createReview(productId, { rating, comment });
      toast.success("Review submitted successfully!");
      setComment("");
      setRating(5);
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate rating statistics
  const ratingStats = {
    average:
      reviews.length > 0
        ? (
            reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
          ).toFixed(1)
        : 0,
    total: reviews.length,
    distribution: [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
      percentage:
        reviews.length > 0
          ? (
              (reviews.filter((r) => r.rating === star).length /
                reviews.length) *
              100
            ).toFixed(0)
          : 0,
    })),
  };

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) =>
      filterRating === "all" ? true : review.rating === parseInt(filterRating)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "helpful":
          return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 rounded-full border-primary-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Overview Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Overall Rating Card */}
        <div className="p-6 text-center border-2 bg-gradient-to-br from-primary-50 to-white border-primary-100 rounded-2xl">
          <div className="mb-2 text-5xl font-bold text-gray-900">
            {ratingStats.average}
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={20}
                className={
                  i < Math.round(ratingStats.average)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <p className="text-sm font-medium text-gray-600">
            {ratingStats.total} {ratingStats.total === 1 ? "Review" : "Reviews"}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="p-6 bg-white border-2 border-gray-100 rounded-2xl lg:col-span-2">
          <div className="space-y-2">
            {ratingStats.distribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center w-12 gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    {star}
                  </span>
                  <FaStar size={12} className="text-yellow-400" />
                </div>
                <div className="flex-1 h-3 overflow-hidden bg-gray-200 rounded-full">
                  <div
                    className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-12 text-sm font-medium text-right text-gray-600">
                  {percentage}%
                </span>
                <span className="w-8 text-xs text-right text-gray-500">
                  ({count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="p-4 space-y-3 bg-white border-2 border-gray-100 rounded-2xl lg:space-y-0 lg:flex lg:items-center lg:justify-between">
        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterRating("all")}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              filterRating === "all"
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterRating("5")}
            className={`flex items-center gap-1 px-2.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              filterRating === "5"
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaStar size={10} className="text-yellow-400" />
            <span>5</span>
          </button>
          <button
            onClick={() => setFilterRating("4")}
            className={`flex items-center gap-1 px-2.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              filterRating === "4"
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaStar size={10} className="text-yellow-400" />
            <span>4</span>
          </button>
          <button
            onClick={() => setFilterRating("3")}
            className={`flex items-center gap-1 px-2.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              filterRating === "3"
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaStar size={10} className="text-yellow-400" />
            <span>3</span>
          </button>
          <button
            onClick={() => setFilterRating("2")}
            className={`flex items-center gap-1 px-2.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              filterRating === "2"
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaStar size={10} className="text-yellow-400" />
            <span>2</span>
          </button>
          <button
            onClick={() => setFilterRating("1")}
            className={`flex items-center gap-1 px-2.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              filterRating === "1"
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaStar size={10} className="text-yellow-400" />
            <span>1</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600 sm:text-sm">
            Sort by
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-3 py-2 text-xs font-semibold bg-white border-2 border-gray-200 sm:flex-none sm:text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="helpful">Most helpful</option>
            <option value="recent">Most recent</option>
            <option value="highest">Highest rating</option>
            <option value="lowest">Lowest rating</option>
          </select>
        </div>
      </div>

      {/* Write Review Button */}
      {isAuthenticated && !showForm && (
        <div className="p-4 border-2 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200 rounded-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="mb-1 text-base font-bold text-gray-900 sm:text-lg">
                Share your thoughts
              </h3>
              <p className="text-xs text-gray-600 sm:text-sm">
                Share your thoughts with other customers
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-white transition-all bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-lg hover:scale-105"
            >
              Write a review
            </button>
          </div>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="p-6 bg-white border-2 border-gray-200 shadow-xl rounded-2xl">
          <h3 className="mb-6 text-xl font-bold text-gray-900">
            Write Your Review
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-5">
            {/* Rating */}
            <div>
              <label className="block mb-3 text-sm font-bold text-gray-900">
                Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform focus:outline-none hover:scale-110"
                  >
                    <FaStar
                      size={32}
                      className={
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block mb-3 text-sm font-bold text-gray-900">
                Your Review *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="5"
                required
                className="w-full px-4 py-3 transition-all border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Share your experience with this product..."
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 text-sm font-bold text-white transition-all sm:flex-1 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full px-6 py-3 text-sm font-bold text-gray-700 transition-all bg-gray-100 sm:w-auto rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="py-16 text-center border-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white rounded-2xl">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full">
            <FaStar size={32} className="text-gray-400" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            No reviews yet
          </h3>
          <p className="text-gray-600">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review._id}
              className="p-6 transition-all bg-white border-2 border-gray-100 rounded-2xl hover:shadow-lg"
            >
              {/* Review Header */}
              <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* User Avatar */}
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-base font-bold text-white rounded-full sm:w-12 sm:h-12 sm:text-lg bg-gradient-to-br from-primary-500 to-primary-600">
                    {review.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-900 truncate sm:text-base">
                        {review.user?.name || "Anonymous"}
                      </span>
                      {review.isVerifiedPurchase && (
                        <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full whitespace-nowrap">
                          <FaCheckCircle size={10} />
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Star Rating */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={12}
                            className={
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 sm:text-sm">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {/* Review Title (if available) */}
                    {review.title && (
                      <h4 className="mb-2 text-sm font-bold text-gray-900 sm:text-base">
                        {review.title}
                      </h4>
                    )}
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <p className="mb-4 text-sm leading-relaxed text-gray-700">
                {review.comment}
              </p>

              {/* Review Actions */}
              {/* <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100 sm:gap-4">
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 transition-all bg-gray-50 rounded-lg hover:bg-gray-100">
                  <FaThumbsUp size={12} />
                  <span className="hidden sm:inline">Helpful</span>
                  <span className="sm:hidden">👍</span>
                  {review.helpfulCount ? ` (${review.helpfulCount})` : ""}
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 transition-all bg-gray-50 rounded-lg hover:bg-gray-100">
                  <FaFlag size={12} />
                  <span>Report</span>
                </button>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;

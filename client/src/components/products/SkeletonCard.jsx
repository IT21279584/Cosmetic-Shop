const SkeletonCard = () => {
  return (
    <div className="relative overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl">
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      <div className="p-4 space-y-3">
        <div className="w-1/4 h-3 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-3/4 h-4 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-1/2 h-3 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex items-center gap-2 mt-3">
          <div className="w-1/3 h-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-1/4 h-4 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
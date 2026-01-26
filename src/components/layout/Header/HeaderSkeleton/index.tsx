// src/components/layout/Header/HeaderSkeleton/index.tsx
const HeaderSkeleton = () => {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex-1">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-8 w-px bg-gray-300"></div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="hidden md:block">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSkeleton;
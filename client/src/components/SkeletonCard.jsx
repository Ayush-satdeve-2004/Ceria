import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
      <div className="skeleton-shimmer h-48 w-full rounded-xl"></div>
      <div className="space-y-2">
        <div className="skeleton-shimmer h-4 w-1/3 rounded-md"></div>
        <div className="skeleton-shimmer h-5 w-5/6 rounded-md"></div>
        <div className="skeleton-shimmer h-4 w-1/4 rounded-md"></div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="skeleton-shimmer h-6 w-1/3 rounded-md"></div>
        <div className="skeleton-shimmer h-8 w-8 rounded-full"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;

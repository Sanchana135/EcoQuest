import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className = 'h-12 w-full', count = 1 }) => {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`bg-slate-200/80 animate-pulse rounded-2xl ${className}`}
        />
      ))}
    </div>
  );
};

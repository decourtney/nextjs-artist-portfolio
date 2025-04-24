import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-50 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
    </div>
  );
}

export default LoadingSpinner

import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[40vh] text-gray-600">
      <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-[#096B68] border-gray-200"></div>
      <p className="mt-4 text-lg">Memuat...</p>
    </div>
  );
};

export default Loading;

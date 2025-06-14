import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[40vh] text-gray-600">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      <p className="mt-4 text-lg">Memuat...</p>
    </div>
  );
};

export default Loading;

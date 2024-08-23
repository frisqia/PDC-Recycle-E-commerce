import React from 'react';

export default function Loading() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex items-center">
        <svg
          className="animate-spin h-8 w-8 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5h3a2 2 0 01-2 2v3z"
          />
        </svg>
        <span className="ml-3 text-lg text-gray-700">Loading...</span>
      </div>
    </main>
  );
}

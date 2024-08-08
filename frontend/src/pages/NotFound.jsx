import React from 'react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600">
        Sorry, the page you are looking for does not exist. You can always go back to the{' '}
        <a href="/" className="text-blue-500 hover:underline">homepage</a>.
      </p>
    </div>
  );
}

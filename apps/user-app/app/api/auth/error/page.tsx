// pages/auth/error.tsx
"use client"
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const ErrorContent = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | string[] | undefined) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid phone number or password';
      case 'PhoneValidation':
        return 'Phone number must be exactly 10 digits';
      case 'PasswordValidation':
        return 'Password must be at least 8 characters long';
      default:
        return error ? `${error}` : 'An unknown error occurred';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full sm:max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
          Oops! Error
        </h1>
        <p className="text-red-600 text-base md:text-lg mb-6">{getErrorMessage(error || '')}</p>
        <a href="/" className="block text-center text-blue-600 hover:text-blue-700">
          Go back to Login Page
        </a>
      </div>
    </div>
  );
};

const ErrorPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
};

export default ErrorPage;

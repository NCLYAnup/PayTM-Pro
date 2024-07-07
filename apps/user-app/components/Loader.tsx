import React from 'react';

interface LoaderProps {
  amount: string;
  recipient: string;
  onClose: () => void;
}

const Loader: React.FC<LoaderProps> = ({ amount, recipient, onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-black">
      <div className="relative flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg">
        <div className="checkmark-circle mb-4">
          <svg className="checkmark w-16 h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
        <div className="text-lg font-medium mb-2">Transaction Successful</div>
        <div className="text-lg font-medium">Amount: {amount}</div>
        <div className="text-lg font-medium">To: {recipient}</div>
      </div>
    </div>
  );
};

export default Loader;

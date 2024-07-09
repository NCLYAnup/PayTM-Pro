
export default function() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
    <main className="flex flex-col md:flex-row justify-between items-center mt-16 px-4 md:px-16">
      <div className="max-w-lg text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Fast, safe social payments
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Pay, get paid, grow a business, and more. Join the tens of millions of people on eWallet.
        </p>
        <button className="bg-blue-500 text-white py-2 px-6 rounded-md text-lg">
          Get eWallet
        </button>
      </div>
      <div className="mt-4 md:mt-0 relative">
        <img
          className="w-80 h-80 md:w-96 md:h-96"
          src="https://cdni.iconscout.com/illustration/premium/thumb/international-payment-4658332-3875735.png?f=webp"
          alt="Online Payments"
        />
         <div className="bg-white p-4 rounded-lg shadow-lg mt-4 flex items-center absolute bottom-0 left-0 transform translate-y-1/2">
            <svg
              className="w-12 h-12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 7H3C2.44772 7 2 7.44772 2 8V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V8C22 7.44772 21.5523 7 21 7Z"
                fill="#4CAF50"
              />
              <path
                d="M4 4H20C20.5523 4 21 4.44772 21 5V6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6V5C3 4.44772 3.44772 4 4 4Z"
                fill="#2196F3"
              />
              <path
                d="M8 11H16C16.5523 11 17 11.4477 17 12V16C17 16.5523 16.5523 17 16 17H8C7.44772 17 7 16.5523 7 16V12C7 11.4477 7.44772 11 8 11Z"
                fill="#FFC107"
              />
            </svg>
          <div className="ml-4">
            <p className="font-semibold text-gray-900">You paid Trish A</p>
            <p className="text-gray-600">Picnic in the park</p>
          </div>
        </div>
      </div>
    </main>
  </div>
      );
    }
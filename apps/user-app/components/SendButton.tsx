"use client"
import { useState } from 'react';
import { TextInput } from '@repo/ui/text-input';
import { Button } from '@repo/ui/button';
import { useRouter } from 'next/navigation';

function handleButtonClick(setLoading: (loading: boolean) => void, setSubmitted: (submitted: boolean) => void, setSuccessMessage: (message: string) => void) {
  setLoading(true);
  fetch('/api/getOnrampTxn')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch transaction data');
      }
      return response.json();
    })
    .then(token1 => {
      const amount = token1?.amount;
      const token = token1?.token;
      const user_identifier = token1?.userId;

      return fetch('https://bank-webhook-handler.vercel.app/hdfcwebhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, amount, user_identifier }),
      });
    })
    .then(webhookResponse => {
      if (!webhookResponse.ok) {
        throw new Error('Failed to send webhook');
      }
      return webhookResponse.json();
    })
    .then(data => {
      console.log(data);
      setSuccessMessage(`Transaction of amount: ${data.amount/100} successful`);
      setSubmitted(true);
    })
    .catch(error => {
      console.error('Error:', error);
    })
    .finally(() => {
      setLoading(false);
    });
}

export function SendButton() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleCancel = () => {
    router.push('/transfer');
    router.refresh();
  };

  return (
    <div>
      {submitted ? (
        <div className="flex flex-col items-center justify-center">
          <div className="p-4 mb-4 text-green-800 bg-green-200 rounded">
            {successMessage}
          </div>
          <Button onClick={() => router.push('/transfer')}>Back</Button>
        </div>
      ) : (
        <>
          <TextInput
            label={"OTP"}
            placeholder={"OTP"}
            onChange={(val) => setOtp(val)}
          />
          <div className="flex flex-row gap-4 items-center justify-center mt-4">
            <Button onClick={() => handleButtonClick(setLoading, setSubmitted, setSuccessMessage)}>
              {loading ? 'Loading...' : 'Submit'}
            </Button>
            <button
              onClick={handleCancel}
             className="bg-red-500 text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none focus:ring-4 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Cancel
            </button>

          </div>
        </>
      )}
    </div>
  );
}

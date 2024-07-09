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

      return fetch('https://bankwebhookhandler-anup-choudhurys-projects.vercel.app/hdfcWebhook', {
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
          <div className="flex flex-col items-center justify-center mt-4">
            <Button onClick={() => handleButtonClick(setLoading, setSubmitted, setSuccessMessage)}>
              {loading ? 'Loading...' : 'Submit'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

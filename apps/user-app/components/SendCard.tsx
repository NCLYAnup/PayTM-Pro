"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/text-input";
import { useState, useEffect } from 'react';
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import { transferState } from "@repo/store/useTransfer";
import { useSetRecoilState } from 'recoil';
import Modal from './Modal';
import Loader from './Loader';
import { useRouter } from 'next/navigation';
import { Notification } from "@repo/ui/notification";

async function fetchNumbers(query: string) {
  const response = await fetch(`/api/search-numbers?q=${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch numbers');
  }
  return response.json();
}

export function SendCard() {
  const [number, setNumber] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const setTransferDetails = useSetRecoilState(transferState);

  useEffect(() => {
    if (number.length > 2) { // Start searching after 3 characters
      fetchNumbers(number)
        .then(data => setSuggestions(data))
        .catch(error => setMessage("Failed to fetch suggestions: " + error.message));
    } else {
      setSuggestions([]);
    }
  }, [number]);

  const handleSend = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await p2pTransfer(number, Number(amount) * 100);
      if (!response.success) {
        setMessage(response.message);
        setModalVisible(false);
      } else {
        setModalVisible(true);
        setTransferDetails({ amount, recipient: number });
      }
    } catch (error: any) {
      setMessage("Transfer Failed: " + error.message);
      setModalVisible(false);
    } finally {
      setLoading(false);
     
    }
  };
  const router = useRouter();
  const handleCloseModal = () => {
    
    setModalVisible(false);
      setAmount("");
      setNumber("");
    router.refresh();
  };
console.log(amount);
  return (
    <div className="">
      <Center>
        <Card title="Send">
          <div className="min-w-72 pt-2">
            <div className="relative">
              <TextInput 
                placeholder="Number" 
                label="Number" 
                onChange={(value) => setNumber(value)} 
                value={number}
              />
                {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-48 overflow-auto rounded-md shadow-lg">
                  {suggestions.map((suggestion, index) => (
                    <li 
                      key={index} 
                      className="p-2 cursor-pointer hover:bg-gray-100 border-b last:border-none"
                      onMouseDown={() => {
                        setNumber(suggestion);
                        setSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <TextInput 
              placeholder="Amount" 
              label="Amount" 
              onChange={(value) => setAmount(value)} 
              value={amount}
            />
            <div className="pt-4 flex justify-center">
              <Button onClick={handleSend} disabled={loading}>
                {loading ? "Processing..." : "Send"}
              </Button>
            </div>
            {message && (
              <Notification type="error" className="pt-4 text-center">
                {message}
              </Notification>
            )}
          </div>
        </Card>
      </Center>
      <Modal isVisible={isModalVisible} onClose={handleCloseModal}>
        <Loader amount={amount} recipient={number} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
}

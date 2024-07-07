"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, CheckIcon, XIcon } from "@heroicons/react/solid";

interface UserDetails {
  name: string | null;
  email: string | null;
}
interface UpdateProfileProps {
  userDetails: UserDetails;
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ userDetails }) =>{
  const [name, setName] = useState(userDetails.name);
  const [email, setEmail] = useState(userDetails.email);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const encodedName = encodeURIComponent(name ?? '');
      const encodedEmail = encodeURIComponent(email ?? '');
      await fetch(`/account?name=${encodedName}&email=${encodedEmail}`);
      setSuccess(true);
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gray-50 shadow-lg rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
        {!isEditing && (
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700"
            onClick={() => setIsEditing(true)}
          >
            <PencilIcon className="h-6 w-6" />
          </button>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          {isEditing ? (
            <input
              type="text"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-lg text-gray-800">{name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          {isEditing ? (
            <input
              type="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-lg text-gray-800">{email}</p>
          )}
        </div>
      </div>
      {isEditing && (
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            className="text-red-500 hover:text-red-700"
            onClick={() => {
              setIsEditing(false);
              setName(userDetails.name);
              setEmail(userDetails.email);
            }}
          >
            <XIcon className="h-6 w-6" />
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : (
              <CheckIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      )}
      {success && (
        <div className="mt-4 p-4 border-l-4 border-green-500 bg-green-50 text-green-700 rounded-md">
          <p className="font-medium">Success!</p>
          <p>User details updated successfully.</p>
        </div>
      )}
    </form>
  );
}
export default UpdateProfile;

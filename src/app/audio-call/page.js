"use client";
import { useState } from "react";
import { Mic, PhoneCall, User } from "lucide-react";

export default function AudioCallPage() {
  const [selectedUser, setSelectedUser] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-md bg-gray-800 shadow-lg border border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Mic className="text-yellow-400" />
          Audio Call
        </h2>

        {/* User Selection */}
        <div className="mt-4">
          <label className="block text-sm text-gray-400 mb-1">Select a User</label>
          <div className="relative">
            <select
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Choose...</option>
              <option value="User1">User 1</option>
              <option value="User2">User 2</option>
              <option value="User3">User 3</option>
            </select>
            <User className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Start Call Button */}
        <button
          className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 rounded-md flex items-center justify-center gap-2"
          disabled={!selectedUser}
        >
          <PhoneCall />
          Start Call
        </button>
      </div>
    </div>
  );
}

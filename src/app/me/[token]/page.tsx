"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface MemberData {
  name: string;
  tshirtSize: string;
  groupName: string;
  groupStatus: string;
  assignedTo: { name: string; tshirtSize: string } | null;
}

export default function MyAssignment() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<MemberData | null>(null);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/members/${token}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      }
    }
    load();
  }, [token]);

  if (error) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-1">{data.groupName}</h2>
        <p className="text-gray-600 mb-6">
          Hey <span className="font-medium">{data.name}</span>, your size is on file
          as <span className="font-medium">{data.tshirtSize}</span>.
        </p>

        {data.groupStatus === "OPEN" ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Assignments haven't been made yet. Check back later!
            </p>
          </div>
        ) : !data.assignedTo ? (
          <p className="text-gray-500">Something went wrong with your assignment.</p>
        ) : !revealed ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Your assignment is ready! Click below to reveal who you're buying an ugly
              t-shirt for.
            </p>
            <button
              onClick={() => setRevealed(true)}
              className="py-3 px-8 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors text-lg"
            >
              Reveal My Person
            </button>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <p className="text-gray-600">You're buying an ugly t-shirt for:</p>
            <div className="bg-gradient-to-r from-pink-100 to-yellow-100 rounded-xl p-6">
              <p className="text-2xl font-bold text-gray-800">{data.assignedTo.name}</p>
              <p className="text-lg text-gray-600 mt-2">
                Size: <span className="font-bold">{data.assignedTo.tshirtSize}</span>
              </p>
            </div>
            <p className="text-sm text-gray-400">
              Remember — the uglier the better!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

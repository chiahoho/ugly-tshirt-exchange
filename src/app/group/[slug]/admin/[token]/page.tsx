"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Member {
  name: string;
  tshirtSize: string;
}

interface GroupData {
  name: string;
  status: string;
  members: Member[];
  slug: string;
  adminToken: string;
}

export default function AdminPage() {
  const { slug, token } = useParams<{ slug: string; token: string }>();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [error, setError] = useState("");
  const [assigning, setAssigning] = useState(false);

  const fetchGroup = useCallback(async () => {
    try {
      const res = await fetch(`/api/groups/${slug}/admin?adminToken=${token}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGroup(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load group");
    }
  }, [slug, token]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  async function handleAssign() {
    if (!confirm("This will randomly assign everyone. You can't undo this. Continue?")) {
      return;
    }
    setAssigning(true);
    setError("");

    try {
      const res = await fetch(`/api/groups/${slug}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminToken: token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await fetchGroup();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assignment failed");
    } finally {
      setAssigning(false);
    }
  }

  if (error && !group) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!group) {
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
        <h2 className="text-xl font-bold text-gray-800 mb-1">{group.name}</h2>
        <p className="text-sm text-gray-500 mb-6">
          Admin Dashboard &middot;{" "}
          <span className={group.status === "ASSIGNED" ? "text-green-600" : "text-yellow-600"}>
            {group.status === "ASSIGNED" ? "Assigned" : "Waiting for members"}
          </span>
        </p>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Members ({group.members.length})
          </h3>
          {group.members.length === 0 ? (
            <p className="text-sm text-gray-400">No one has joined yet.</p>
          ) : (
            <ul className="space-y-2">
              {group.members.map((m, i) => (
                <li key={i} className="flex justify-between bg-gray-50 rounded-lg px-4 py-2">
                  <span className="text-gray-800">{m.name}</span>
                  <span className="text-gray-500 text-sm">Size: {m.tshirtSize}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {group.status === "OPEN" && (
          <>
            <button
              onClick={handleAssign}
              disabled={assigning || group.members.length < 2}
              className="w-full py-2 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {assigning ? "Assigning..." : "Assign Everyone"}
            </button>
            {group.members.length < 2 && (
              <p className="text-xs text-gray-400 mt-2 text-center">
                Need at least 2 members to assign.
              </p>
            )}
          </>
        )}

        {group.status === "ASSIGNED" && (
          <p className="text-center text-green-600 font-medium">
            Everyone has been assigned! They can check their personal link to see who they got.
          </p>
        )}

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}

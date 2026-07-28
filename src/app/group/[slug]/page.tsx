"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export default function JoinGroup() {
  const { slug } = useParams<{ slug: string }>();
  const [name, setName] = useState("");
  const [tshirtSize, setTshirtSize] = useState("");
  const [result, setResult] = useState<{ viewLink: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/groups/${slug}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tshirtSize }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Join the Exchange</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Enter your name and t-shirt size to join.
        </p>

        {!result ? (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none text-gray-800"
                required
              />
            </div>
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                T-Shirt Size
              </label>
              <select
                id="size"
                value={tshirtSize}
                onChange={(e) => setTshirtSize(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none text-gray-800 bg-white"
                required
              >
                <option value="">Select your size</option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "Joining..." : "Join Group"}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-green-600 font-medium">You're in!</p>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Bookmark this link to see your assignment later:
              </p>
              <CopyableLink href={result.viewLink} />
            </div>
            <p className="text-xs text-gray-500">
              Don't share this link — it's your personal page to see who you got.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CopyableLink({ href }: { href: string }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== "undefined" ? window.location.origin + href : href;

  function copy() {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border">
      <code className="text-sm text-gray-800 flex-1 truncate">{fullUrl}</code>
      <button
        onClick={copy}
        className="text-xs px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors shrink-0 text-gray-700"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

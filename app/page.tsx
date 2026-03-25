"use client";

import { useState } from "react";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [state, setState] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/coaching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal, state }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult(data.error || "エラーが発生しました。");
      } else {
        setResult(data.text);
      }
    } catch {
      setResult("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-4xl font-bold">Goal Coach</h1>
        <p className="mb-8 text-gray-600">
          目標と現在の状況を入力すると、AIが今日の行動を提案します。
        </p>

        <div className="space-y-4 rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div>
            <label className="mb-2 block text-sm font-medium">目標</label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              placeholder="例：3か月以内に副業で月5万円を達成したい"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">現在の状況</label>
            <textarea
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="min-h-[140px] w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              placeholder="例：やる気はあるが、何から始めればいいか曖昧で止まりやすい"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
          >
            {loading ? "AIが考え中..." : "AIコーチングを実行"}
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-semibold">結果</h2>
          <div className="whitespace-pre-wrap text-gray-800">
            {result || "ここにAIの提案が表示されます。"}
          </div>
        </div>
      </div>
    </main>
  );
}
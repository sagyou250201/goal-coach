"use client";

import { useState } from "react";

type AnswerValue = "A" | "B" | "C" | "";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [state, setState] = useState("");

  const [q1, setQ1] = useState<AnswerValue>("");
  const [q2, setQ2] = useState<AnswerValue>("");
  const [q3, setQ3] = useState<AnswerValue>("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const surveyOptions = {
    q1: {
      title: "Q1. 今日の行動意欲に一番近いもの",
      options: [
        { value: "A", label: "すぐ行動できそう" },
        { value: "B", label: "少し迷っている" },
        { value: "C", label: "かなり止まり気味" },
      ],
    },
    q2: {
      title: "Q2. 目標達成の見通しに一番近いもの",
      options: [
        { value: "A", label: "やり方がある程度見えている" },
        { value: "B", label: "ぼんやりしている" },
        { value: "C", label: "何から始めるか分からない" },
      ],
    },
    q3: {
      title: "Q3. 今日いちばん大きい壁に近いもの",
      options: [
        { value: "A", label: "時間が足りない" },
        { value: "B", label: "気持ちが乗らない" },
        { value: "C", label: "具体的な一歩が不明" },
      ],
    },
  };

  const answerTextMap = {
    q1: {
      A: "すぐ行動できそう",
      B: "少し迷っている",
      C: "かなり止まり気味",
    },
    q2: {
      A: "やり方がある程度見えている",
      B: "ぼんやりしている",
      C: "何から始めるか分からない",
    },
    q3: {
      A: "時間が足りない",
      B: "気持ちが乗らない",
      C: "具体的な一歩が不明",
    },
  };

  const handleSubmit = async () => {
    if (!goal || !deadline || !state || !q1 || !q2 || !q3) {
      setResult("すべて入力・選択してください。");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/coaching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          deadline,
          state,
          surveyAnswers: [
            {
              question: surveyOptions.q1.title,
              answer: answerTextMap.q1[q1],
            },
            {
              question: surveyOptions.q2.title,
              answer: answerTextMap.q2[q2],
            },
            {
              question: surveyOptions.q3.title,
              answer: answerTextMap.q3[q3],
            },
          ],
        }),
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

  const renderQuestion = (
    name: string,
    title: string,
    options: { value: string; label: string }[],
    selected: string,
    onChange: (value: AnswerValue) => void
  ) => {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold leading-6 text-gray-900 sm:text-base">
          {title}
        </p>
        <div className="space-y-3">
          {options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <label
                key={`${name}-${option.value}`}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                  isSelected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => onChange(option.value as AnswerValue)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-800 sm:text-base">
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-8 text-gray-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 rounded-3xl bg-white px-6 py-8 shadow-sm ring-1 ring-gray-100 sm:px-8">
          <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-blue-700">
            GOAL COACH
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            目標達成のための
            <br className="sm:hidden" />
            行動コーチング
          </h1>
          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            目標・期限・現在の状況と、3つのアンケート回答をもとに、
            AIが今日の優先行動を提案します。
          </p>
        </div>

        <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              目標
            </label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:text-base"
              placeholder="例：副業で月5万円を達成したい"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              期限
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:text-base"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              現在の状況
            </label>
            <textarea
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="min-h-[150px] w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:text-base"
              placeholder="例：やる気はあるが、何から始めればよいか曖昧で止まりやすい"
            />
          </div>

          <div className="pt-2">
            <h2 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">
              今日の簡単アンケート
            </h2>
            <div className="space-y-4">
              {renderQuestion(
                "q1",
                surveyOptions.q1.title,
                surveyOptions.q1.options,
                q1,
                setQ1
              )}
              {renderQuestion(
                "q2",
                surveyOptions.q2.title,
                surveyOptions.q2.options,
                q2,
                setQ2
              )}
              {renderQuestion(
                "q3",
                surveyOptions.q3.title,
                surveyOptions.q3.options,
                q3,
                setQ3
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-2xl bg-gray-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50 sm:text-base"
          >
            {loading ? "AIが考え中..." : "AIコーチングを実行"}
          </button>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">結果</h2>
          <div className="whitespace-pre-wrap text-sm leading-7 text-gray-800 sm:text-base">
            {result || "ここにAIの提案が表示されます。"}
          </div>
        </div>
      </div>
    </main>
  );
}
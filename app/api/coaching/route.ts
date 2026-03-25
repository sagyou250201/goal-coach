import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const goal = body.goal ?? "";
    const state = body.state ?? "";

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set." },
        { status: 500 }
      );
    }

    const prompt = `
あなたは行動変容に強いコーチです。
ユーザーを否定せず、今日すぐ実行できる具体的な一歩を提案してください。

目標:
${goal}

現在の状況:
${state}

以下の形式で日本語で返してください。
- 現在の状態
- 今日やるべきこと
- 一言アドバイス
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "AIの返答を取得できませんでした。";

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", detail: String(error) },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const goal = body.goal ?? "";
    const deadline = body.deadline ?? "";
    const state = body.state ?? "";
    const surveyAnswers =
      Array.isArray(body.surveyAnswers) ? body.surveyAnswers : [];

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set." },
        { status: 500 }
      );
    }

    const surveyText = surveyAnswers
      .map(
        (item: { question?: string; answer?: string }, index: number) =>
          `Q${index + 1}: ${item.question ?? ""}\n回答: ${item.answer ?? ""}`
      )
      .join("\n\n");

    const prompt = `
あなたは行動変容に強い日本語コーチです。
ユーザーを否定せず、甘やかしすぎず、今日すぐ実行できる具体的な一歩を提案してください。
内容は実用的で、短すぎず、わかりやすくしてください。

以下の情報をもとに、日本語でコーチングしてください。

【目標】
${goal}

【期限】
${deadline}

【現在の状況】
${state}

【アンケート回答】
${surveyText}

以下の形式で返してください。
【現在の状態】
...
【今日やるべきこと】
...
【一言アドバイス】
...
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
export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16">
        <h1 className="mb-4 text-4xl font-bold">Goal Coach</h1>
        <p className="mb-8 text-center text-lg text-gray-600">
          目標達成のために、毎日の思考と行動を記録し、
          AIが今やるべき一歩を提案するコーチングアプリ
        </p>

        <div className="w-full rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold">MVPで実装すること</h2>
          <ul className="space-y-2 text-gray-700">
            <li>・目標を3つ登録する</li>
            <li>・毎日3問の4択に回答する</li>
            <li>・AIが今日の行動を提案する</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
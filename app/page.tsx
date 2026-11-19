import  Link  from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">Welcome to Workout Logger</h1>

      <p className="mt-2 text-gray-600">
        Log your workouts, record each exercise, rep and set counts, and track your progress over time.
      </p>

      <Link
        href="/login"
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Get Started
      </Link>

    </main>

  );
}

import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="border-t bg-white">
      <ul className="flex justify-around py-4">
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link href="/workouts">History</Link>
        </li>

        <li>
          <Link href="/progress">Progress</Link>
        </li>

        <li>
          <Link href="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
}
import Link from "next/link";
import Image from "next/image";
import GuestRoute from "@/components/GuestRoute";

export default function Home() {
  return (
    <GuestRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-400">
        <h1 className="text-4xl font-bold text-black mb-8 text-center">
          Welcome to Money Tracker
        </h1>
        <p className="text-xl text-black text-center mb-8">
          Money Tracker is a powerful application that helps you manage your
          finances effectively. With Money Tracker, you can easily track your
          income and expenses, set budgets, and gain insights into your spending
          habits.
        </p>
        <div className="mb-8">
          <Image
            src="https://ashecone.github.io/expense-tracker/logo.png"
            alt="Money Tracker Logo"
            width={200}
            height={200}
          />
        </div>
        <div className="flex space-x-4">
          <Link href="/signup">
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold hover:font-extrabold rounded-lg shadow-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
              Sign Up
            </button>
          </Link>
          <Link href="/signin">
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold hover:font-extrabold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </GuestRoute>
  );
}

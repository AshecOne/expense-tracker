"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import NavbarLayout from "../NavbarLayout";
import UserMenu from "@/components/UserMenu";
import { FiArrowDownCircle, FiArrowUpCircle } from "react-icons/fi";
import ProtectedRoute from "@/components/ProtectedRoute";
import ClientOnly from "@/components/ClientOnly";

interface IDashboardProps {}

interface Transaction {
  id: number;
  amount: number;
  date: string;
  category: string;
  type: string;
}

const Dashboard: React.FunctionComponent<IDashboardProps> = (props) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const user = useAppSelector((state: any) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      console.log(`Fetching transactions for user ID: ${user.id}`);
      try {
        if (!user.id) return;
        const response = await axios.get(
          `http://localhost:3400/users/transactions?userId=${user.id}`
        );
        const { balance, transactions } = response.data;
        console.log("Transactions fetched from the server:", transactions);

        const convertedTransactions = transactions.map((t: any) => ({
          ...t,
          amount: Number(t.amount),
        }));
        console.log(`Balance updated to: Rp.${Number(balance).toFixed(2)}`);
        console.log("Transactions state updated:", convertedTransactions);

        setBalance(Number(balance));
        setTransactions(convertedTransactions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user.id, dispatch]);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleUserMenu = () => {
    console.log(`User menu is now ${isUserMenuOpen ? "closed" : "opened"}`);
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const formatDate = (dateString?: string): string => {
    console.log(`Formatting date: ${dateString}`);
    if (!dateString) {
      return "Invalid Date";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <ClientOnly>
      <ProtectedRoute>
        <NavbarLayout>
          <div className="container mx-auto px-4 pt-8 pb-20 min-h-screen bg-gradient-to-br from-white to-blue-400">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-black">Dashboard</h1>
              <div className="relative">
                <div
                  className="text-lg text-black font-semibold cursor-pointer hover:underline hover:text-blue-600 hover:font-extrabold"
                  onClick={toggleUserMenu}
                >
                  Hi, {user.name}
                </div>
                {isUserMenuOpen && <UserMenu onClose={toggleUserMenu} />}
              </div>
            </div>
            <div className="bg-blue-400 rounded-lg shadow-md p-6 text-white mb-8">
              <h2 className="text-xl font-bold mb-2">Balance</h2>
              <p className="text-3xl">Rp.{balance.toFixed(2)}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 text-black">
                Last Transactions
              </h2>
              {transactions.length === 0 ? (
                <p className="text-black text-xl">No data available</p>
              ) : (
                <ul>
                  {transactions.slice(0, 5).map((transaction) => (
                    <li
                      key={transaction.id}
                      className="mb-4 bg-gray-100 rounded-lg shadow-md p-4 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="text-lg font-bold mb-2 text-black">
                          {transaction.category}
                        </h3>
                        <p className="text-black">
                          {transaction.type === "income" ? "+ " : "- "}
                          Rp {transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-black">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                      {transaction.type === "income" ? (
                        <FiArrowUpCircle className="text-green-500" size={24} />
                      ) : (
                        <FiArrowDownCircle className="text-red-500" size={24} />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </NavbarLayout>
      </ProtectedRoute>
    </ClientOnly>
  );
};

export default Dashboard;

"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAppSelector } from "@/lib/hooks";
import NavbarLayout from "../NavbarLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import ClientOnly from "@/components/ClientOnly";

interface ITransaction {
  id_transaction: number;
  type: string;
  amount: number;
  date: string;
  category: string;
}

interface ISortirProps {}

const Sortir: React.FunctionComponent<ISortirProps> = (props) => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [dateRange, setDateRange] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const user = useAppSelector((state: any) => state.user);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `https://secure-basin-94383-7efd7c1abae1.herokuapp.com/users/transactions?userId=${user.id}&orderBy=date&order=desc`
      );
      console.log(response.data);

      if (response.data && Array.isArray(response.data.transactions)) {
        const convertedTransactions = response.data.transactions.map(
          (transaction: ITransaction) => ({
            ...transaction,
            amount: Number(transaction.amount),
          })
        );
        setTransactions(convertedTransactions);
      } else if (Array.isArray(response.data)) {
        const convertedTransactions = response.data.map(
          (transaction: ITransaction) => ({
            ...transaction,
            amount: Number(transaction.amount),
          })
        );
        setTransactions(convertedTransactions);
      } else {
        console.error("Received non-array transactions data", response.data);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleFilter = async () => {
    console.log("Filtering with", { dateRange, type, category });
    try {
      let url = `https://secure-basin-94383-7efd7c1abae1.herokuapp.com/users/transactions/filter?userId=${user.id}`;

      if (dateRange) {
        const [startDate, endDate] = dateRange.split(" ");
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      if (type) {
        url += `&type=${type}`;
      }

      if (category) {
        url += `&category=${category}`;
      }

      const response = await axios.get(url);
      console.log("Filtered data", response.data);
      const convertedTransactions = response.data.map(
        (transaction: ITransaction) => ({
          ...transaction,
          amount: Number(transaction.amount),
        })
      );
      setTransactions(convertedTransactions);
    } catch (error) {
      console.error("Error filtering transactions:", error);
    }
  };

  return (
    <ClientOnly>
      <ProtectedRoute>
        <NavbarLayout>
          <div className="container mx-auto px-4 min-h-screen pt-8 pb-20 bg-gradient-to-br from-white to-blue-400">
            <h2 className="text-2xl font-bold mb-4 text-black">Transactions</h2>
            <div className="bg-white p-4 rounded shadow mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="dateRange"
                    className="block mb-2 font-bold text-black"
                  >
                    Date Range:
                  </label>
                  <input
                    type="text"
                    id="dateRange"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    placeholder="YYYY-MM-DD - YYYY-MM-DD"
                    className="w-full px-4 py-2 border rounded text-black"
                  />
                </div>
                <div>
                  <label
                    htmlFor="type"
                    className="block mb-2 font-bold text-black"
                  >
                    Type:
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2 border rounded text-black"
                  >
                    <option value="">All</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block mb-2 font-bold text-black"
                  >
                    Category:
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border rounded text-black"
                  />
                </div>
              </div>
              <button
                onClick={handleFilter}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
              >
                Filter
              </button>
            </div>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id_transaction}
                    className="bg-white p-4 rounded shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-black">
                        {transaction.category}
                      </span>
                      <span
                        className={`text-sm ${
                          transaction.type === "income"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-black">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>
                      <span className="text-xl font-bold text-black">
                        Rp {transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-center text-black text-xl font-medium">
                    No data found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </NavbarLayout>
      </ProtectedRoute>
    </ClientOnly>
  );
};

export default Sortir;

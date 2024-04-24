"use client";
import * as React from "react";
import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import { useAppSelector } from "@/lib/hooks";
import NavbarLayout from "../NavbarLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import ClientOnly from "@/components/ClientOnly";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

interface ITransaction {
  id_transaction: number;
  type: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
}

interface ISortirProps {}

const Sortir: React.FunctionComponent<ISortirProps> = (props) => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [dateRange, setDateRange] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const user = useAppSelector((state: any) => state.user);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null
  );
  const router = useRouter();

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/transactions/all?userId=${user.id}&orderBy=date&order=desc`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);

      if (response.data && Array.isArray(response.data.transactions)) {
        const convertedTransactions = response.data.transactions.map(
          (transaction: ITransaction) => ({
            ...transaction,
            amount: Number(transaction.amount),
            description: transaction.description,
          })
        );
        setTransactions(convertedTransactions);
      } else if (Array.isArray(response.data)) {
        const convertedTransactions = response.data.map(
          (transaction: ITransaction) => ({
            ...transaction,
            amount: Number(transaction.amount),
            description: transaction.description,
          })
        );
        setTransactions(convertedTransactions);
      } else {
        console.error("Received non-array transactions data", response.data);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  const handleFilter = async () => {
    console.log("Filtering with", { dateRange, type, category });
    try {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_API_URL}/users/transactions/filter?userId=${user.id}`;

      if (dateRange) {
        const [startDate, endDate] = dateRange.split(" - ");
        if (startDate && endDate) {
          url += `&startDate=${startDate}&endDate=${endDate}`;
          console.log("Date range:", startDate, endDate);
        }
      }

      if (type) {
        url += `&type=${type}`;
        console.log("Type:", type);
      }

      if (category) {
        url += `&category=${category}`;
        console.log("Category:", category);
      }

      console.log("Final URL:", url);

      const response = await axios.get(url, {
        withCredentials: true,
      });

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      const convertedTransactions = response.data.map(
        (transaction: ITransaction) => ({
          ...transaction,
          amount: Number(transaction.amount),
        })
      );

      console.log("Converted transactions:", convertedTransactions);

      setTransactions(convertedTransactions);
    } catch (error) {
      console.error("Error filtering transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (transactionId: number) => {
    setTransactionToDelete(transactionId);
    setDeleteConfirmationOpen(true);
  };
  const confirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/users/transactions/${transactionToDelete}`,
          {
            withCredentials: true,
          }
        );
        console.log("Transaction deleted successfully");
        toast.success("Transaction deleted successfully");
        setDeleteConfirmationOpen(false);
        setTransactionToDelete(null);
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
        toast.error("Failed to delete transaction");
      }
    }
  };

  const handleEdit = (transactionId: number) => {
    router.push(`/edit?id=${transactionId}`);
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
              {deleteConfirmationOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded shadow">
                    <p className="text-black mb-4">
                      Are you sure you want to delete this transaction?
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setDeleteConfirmationOpen(false)}
                        className="px-4 py-2 bg-gray-300 text-black rounded mr-2"
                      >
                        No
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {loading ? (
                <div className="flex justify-center items-center mt-8">
                  <ClipLoader color="#0b11df" size={40} />
                </div>
              ) : transactions.length > 0 ? (
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
                    <div className="flex py-3 text-black">
                      <span className="text-lg font-bold text-black">
                        Description:
                      </span>
                      {transaction.description ? (
                        <p className="text-lg text-opacity-75 ml-2">
                          {transaction.description}
                        </p>
                      ) : (
                        <p className="text-lg text-opacity-75 ml-2">-</p>
                      )}
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleEdit(transaction.id_transaction)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id_transaction)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                      >
                        Delete
                      </button>
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
          <ToastContainer />
        </NavbarLayout>
      </ProtectedRoute>
    </ClientOnly>
  );
};

export default Sortir;

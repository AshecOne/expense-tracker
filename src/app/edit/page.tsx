"use client";
import * as React from "react";
import { Suspense, useState, useEffect } from "react";
import axios from "axios";
import { useAppSelector } from "@/lib/hooks";
import NavbarLayout from "../NavbarLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import ClientOnly from "@/components/ClientOnly";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useParams } from "next/navigation";
import { ClipLoader } from "react-spinners";

const Edit: React.FunctionComponent = () => {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const user = useAppSelector((state: any) => state.user);
  const router = useRouter();
  const { id: transactionId } = useParams();

  useEffect(() => {
    const fetchTransaction = async () => {
      if (transactionId) {
        try {
          const response = await axios.get(
            `https://secure-basin-94383-7efd7c1abae1.herokuapp.com/users/transactions/${transactionId}`,
            { withCredentials: true }
          );
          const { type, amount, description, category, date } = response.data;
          setType(type);
          setAmount(amount.toString());
          setDescription(description);
          setCategory(category);
          setDate(date);
        } catch (error) {
          console.error("Error fetching transaction:", error);
        }
      }
    };

    fetchTransaction();
  }, [transactionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (transactionId) {
      try {
        await axios.put(
          `https://secure-basin-94383-7efd7c1abae1.herokuapp.com/users/transactions/${transactionId}`,
          {
            type,
            amount: parseFloat(amount),
            description,
            category,
            date,
            userId: user.id,
          },
          { withCredentials: true }
        );
        toast.success("Transaction updated successfully");
        router.push("/sortir");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            "Failed to update transaction: " +
              (error.response?.data.message || "Unknown error")
          );
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    }
  };

  const handleTypeChange = (newType: string) => {
    console.log(`Transaction type changed to: ${newType}`);
    setType(newType);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Amount changed to: ${e.target.value}`);
    setAmount(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Description changed to: ${e.target.value}`);
    setDescription(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Category changed to: ${e.target.value}`);
    setCategory(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Date changed to: ${e.target.value}`);
    setDate(e.target.value);
  };
  return (
    <ClientOnly>
      <ProtectedRoute>
        <NavbarLayout>
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                <ClipLoader color="#0b11df" size={150} />
              </div>
            }
          >
            <div className="min-h-screen mx-auto px-4 py-8 bg-gradient-to-br from-white to-blue-400">
              <h2 className="text-2xl font-bold mb-4 text-black">
                Edit Transaction
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="type"
                    className="block mb-2 text-black font-bold"
                  >
                    Type:
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-l ${
                        type === "expense"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                      onClick={() => handleTypeChange("expense")}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-r ${
                        type === "income"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                      onClick={() => handleTypeChange("income")}
                    >
                      Income
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="date"
                    className="block mb-2 text-black font-bold"
                  >
                    Date:
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={handleDateChange}
                    className="w-full px-4 py-2 border rounded text-black"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="block mb-2 text-black font-bold"
                  >
                    Category:
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2 border rounded text-black"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-black font-bold"
                  >
                    Description (Optional):
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="w-full px-4 py-2 border rounded text-black"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="amount"
                    className="block mb-2 text-black font-bold"
                  >
                    Total:
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full px-4 py-2 border rounded text-black"
                    required
                  />
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded text-black"
                    onClick={() => {
                      setAmount("");
                      setDescription("");
                      setCategory("");
                      setDate("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </Suspense>
          <ToastContainer />
        </NavbarLayout>
      </ProtectedRoute>
    </ClientOnly>
  );
};

export default Edit;

import {
  UserIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import api from "../utils/api";
import LoadingSekeleton from "./LoadingSekeleton";
import FailedToLoad from "./FailedToLoad";

function BankAccount({ setShowAlert, dataUser }) {
  const API = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const [dataBank, setDataBank] = useState({
    name: "",
    bank: "",
    number: "",
    userId: dataUser.id,
  });
  const handleChange = async (e) => {
    setDataBank((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post(API + "/bankaccount", {
        name: dataBank.name,
        bank: dataBank.bank,
        number: dataBank.number,
        userId: dataBank.userId,
      });
      if (response.data.success) {
        mutate("/v1/get/bankaccount");
        setShowAlert("Saved");
        setDataBank({
          name: "",
          bank: "",
          number: "",
          userId: dataUser.id,
        });
        setLoading(false);
        const timer = setTimeout(() => {
          setShowAlert("");
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id, name) => {
    if (confirm(`Delete ${name}?`) == true) {
      deleteBank(id);
    }
  };

  const deleteBank = async (id) => {
    try {
      setLoading(true);
      const response = await api.delete(API + "/bankaccount/" + id);
      if (response.data.success) {
        mutate("/v1/get/bankaccount");
        setShowAlert("Deleted Successfully");
        setLoading(false);
        const timer = setTimeout(() => {
          setShowAlert("");
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.log(err);
    }
  };

  const fetcher = async () => {
    try {
      const response = await api.get(API + "/bankaccount");

      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, error, isLoading } = useSWR("/v1/get/bankaccount", fetcher);

  if (error) return <FailedToLoad />;
  if (isLoading) return <LoadingSekeleton />;

  return (
    <div className="w-full rounded-xl shadow-xl mb-6">
      <h1 className="text-2xl text-center w-full py-2 bg-gray-700">Rekening</h1>
      <div
        className={
          "py-2 px-3 " +
          (loading ? "opacity-50 cursor-not-allowed pointer-events-none" : "")
        }
      >
        <form action="" autoComplete="off" onSubmit={handleSubmit}>
          <div className="my-2 text-center">
            <label className="input input-bordered input-sm md:input-md flex items-center gap-2 mb-2">
              <UserIcon className="h-4 w-4" />
              <input
                type="text"
                name="name"
                value={dataBank.name}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="Nama Rekening"
              />
            </label>
            <label className="input input-bordered input-sm md:input-md flex items-center gap-2 mb-2">
              <BuildingLibraryIcon className="h-4 w-4" />
              <input
                type="text"
                name="bank"
                value={dataBank.bank}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="Nama Bank"
              />
            </label>
            <label className="input input-bordered input-sm md:input-md flex items-center gap-2 mb-2">
              <CreditCardIcon className="h-4 w-4" />
              <input
                type="number"
                name="number"
                value={dataBank.number}
                onChange={(e) => handleChange(e)}
                onFocus={(e) => {
                  e.target.addEventListener(
                    "wheel",
                    function (e) {
                      e.preventDefault();
                    },
                    {
                      passive: false,
                    }
                  );
                }}
                className="grow"
                placeholder="Nomor Rekening"
              />
            </label>
            <div className="text-right">
              <button
                type="submit"
                className="btn btn-primary btn-sm md:btn-md"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </form>
        <div className="overflow-x-auto">
          <table className="table text-white">
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>
                <th className="hidden md:block">Account</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ id, name, bank, number }, key) => (
                <tr key={key}>
                  <td>
                    {name} <br />
                    <span className="badge badge-ghost badge-sm md:hidden">
                      {`${bank.toUpperCase()} : ${number}`}
                    </span>
                  </td>
                  <td className="hidden md:block">
                    {bank.toUpperCase()} :
                    <span className="font-light"> {number}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(id, name)}
                      className="btn btn-xs text-white bg-red-500 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BankAccount;

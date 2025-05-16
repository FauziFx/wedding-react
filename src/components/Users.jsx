import React, { useState } from "react";
import {
  ArrowUpRightIcon,
  PaperAirplaneIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import api from "../utils/api";
import LoadingSekeleton from "./LoadingSekeleton";
import FailedToLoad from "./FailedToLoad";
import useSWR, { useSWRConfig } from "swr";

function Users({ setShowAlert, dataUser }) {
  const API = import.meta.env.VITE_API_URL;
  const { mutate } = useSWRConfig();

  const handleDelete = (id, name) => {
    if (confirm(`Delete ${name}?`) == true) {
      deleteUser(id);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await api.delete(API + "/users/" + id);
      if (response.data.success) {
        mutate("/v1/get/users");
        setShowAlert("Deleted Successfully");
        const timer = setTimeout(() => {
          setShowAlert("");
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetcher = async () => {
    try {
      const response = await api.get(API + "/users");

      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, error, isLoading } = useSWR("/v1/get/users", fetcher);

  if (error) return <FailedToLoad />;
  if (isLoading) return <LoadingSekeleton />;
  return (
    <div className="col-span-3 px-4 pt-2">
      <div className="flex justify-between items-center w-full rounded-xl bg-white text-gray-900 py-2 px-3 mb-6">
        <p>Users</p>
      </div>
      <div className="overflow-x-auto">
        <table className="table text-white">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Link</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ id, name, email, custom_url }, key) => (
              <tr key={key}>
                <td>
                  {name} <br />
                  <span className="badge badge-ghost badge-sm px-0">
                    {email}
                  </span>
                </td>
                <td className="hidden md:block">
                  <a
                    href={window.location.origin + "/" + custom_url?.url}
                    target="_blank"
                  >
                    {window.location.origin + "/" + custom_url?.url}
                  </a>
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
  );
}

export default Users;

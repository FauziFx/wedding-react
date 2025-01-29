import { LockClosedIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import api from "../utils/api";

function ChangePassword({ logout, setShowAlert, dataUser }) {
  const API = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    id: dataUser.id,
    name: dataUser.name,
    email: dataUser.email,
  });

  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = async (e) => {
    setData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.patch(`${API}/users/${user.id}`, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      if (!response.data.success) {
        alert(response.data.message);
      } else {
        setShowAlert("Password Changed!");
        setData({
          oldPassword: "",
          newPassword: "",
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

  return (
    <div className="w-full rounded-xl shadow-xl mb-6">
      <h1 className="text-2xl text-center w-full py-2 bg-gray-700">Account</h1>
      <div
        className={
          "py-2 px-3 " +
          (loading ? "opacity-50 cursor-not-allowed pointer-events-none" : "")
        }
      >
        <table>
          <tbody>
            <tr>
              <td>Name</td>
              <td className="mx-2">:</td>
              <td>{user.name}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td className="mx-2">:</td>
              <td>{user.email}</td>
            </tr>
          </tbody>
        </table>
        <div className="my-2 text-center">
          <form action="" autoComplete="off" onSubmit={handleSubmit}>
            <label className="input input-bordered input-sm md:input-md flex items-center gap-2 mb-2">
              <LockClosedIcon className="h-4 w-4" />
              <input
                type="password"
                name="oldPassword"
                value={data.oldPassword}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="Old Password"
                required
              />
            </label>
            <label className="input input-bordered input-sm md:input-md flex items-center gap-2 mb-2">
              <LockClosedIcon className="h-4 w-4" />
              <input
                type="password"
                name="newPassword"
                value={data.newPassword}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="New Password"
                min={8}
                required
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
                  "Change Password"
                )}
              </button>
            </div>
          </form>
          <button
            className="btn btn-error btn-sm md:btn-md w-full mt-4 rounded-full md:hidden"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;

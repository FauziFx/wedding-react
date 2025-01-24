import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import Cookies from "js-cookie";

function Login() {
  const API = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = async (e) => {
    setUser((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API + "/auth", {
        email: user.email,
        password: user.password,
      });

      if (!response.data.success) {
        alert(response.data.message);
      } else {
        const data = response.data.data;
        const token = data.token;
        const decode = jwtDecode(token);
        const config = {
          id: decode.id,
          name: decode.name,
          email: decode.email,
        };
        localStorage.setItem("config", JSON.stringify(config));
        Cookies.set("token", token, { expires: 1 });

        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-4 rounded-xl shadow-xl border border-gray-500">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form className="space-y-4" autoComplete="off" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={(e) => handleChange(e)}
              placeholder="Enter your email"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={(e) => handleChange(e)}
              placeholder="Enter your password"
              className="input input-bordered w-full"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

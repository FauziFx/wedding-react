import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

function SignUp() {
  const API = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
  });

  useEffect(() => {
    if (user.confirmPassword && user.password !== user.confirmPassword) {
      setUser((prevState) => ({
        ...prevState,
        error: "Password dan konfirmasi password harus sama!",
      }));
    } else {
      setUser((prevState) => ({
        ...prevState,
        error: "",
      }));
    }
  }, [user.password, user.confirmPassword]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (user.error) return setIsLoading(false);

    try {
      const response = await axios.post(API + "/auth/signup", {
        name: user.name,
        email: user.email,
        password: user.password,
      });

      if (!response.data.success) {
        alert(response.data.message);
      } else {
        alert("Sign up successful, please login.");
        window.location.href = "/auth";
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-4 p-8 space-y-4 rounded-xl shadow-xl border border-gray-500">
        <h1
          className="text-4xl font-medium text-center"
          style={{ fontSize: "40px" }}
        >
          <Link to="/">Kabar Cinta</Link>
        </h1>
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form className="space-y-1" autoComplete="off" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={(e) => handleChange(e)}
              placeholder="Enter your Name"
              className="input input-bordered w-full"
              required
            />
          </div>
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
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={(e) => handleChange(e)}
              placeholder="Confirm password"
              className={`input input-bordered w-full ${
                user.error && "border-red-500 focus:border-red-500"
              }`}
              required
            />
            {user.error && (
              <p className="text-sm" style={{ color: "red" }}>
                {user.error}
              </p>
            )}
          </div>
          &nbsp;
          <div className="space-y-2">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Sign Up"
              )}
            </button>
            <div className="text-center text-xs">-OR-</div>
            <Link to="/auth" className="btn mt-0 w-full" disabled={isLoading}>
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;

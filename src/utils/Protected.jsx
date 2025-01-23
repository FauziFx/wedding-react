import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

function Protected() {
  const refresToken = Cookies.get("token");

  return refresToken ? <Outlet /> : <Navigate to="/auth" replace />;
}

export default Protected;

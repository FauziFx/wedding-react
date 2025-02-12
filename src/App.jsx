import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import InvitationPage from "./pages/InvitationPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedAuth from "./utils/ProtectedAuth";
import Protected from "./utils/Protected";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route element={<ProtectedAuth />}>
        <Route path="/auth" element={<Login />} />
      </Route>
      <Route path="/auth/*" element={<NotFoundPage />} />
      <Route element={<Protected />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/dashboard/*" element={<NotFoundPage />} />
      <Route path="/:url" element={<InvitationPage />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
}

function NotFoundPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl">404 Not Found</h1>
      <a href="/" className="btn btn-sm">
        Back to Home
      </a>
    </div>
  );
}

export default App;

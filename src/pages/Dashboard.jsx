import {
  AdjustmentsHorizontalIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowUpRightIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  FireIcon,
  HomeIcon,
  MapIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  TrashIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";
import Cookies from "js-cookie";
import ChangePassword from "../components/ChangePassword";
import Guestbook from "../components/Guestbook";
import BankAccount from "../components/BankAccount";
import General from "../components/General";
import Foto from "../components/Foto";
import Pengantin from "../components/Pengantin";
import Gallery from "../components/Gallery";

function Dashboard() {
  const [menu, setMenu] = useState("home");
  const dataUser = JSON.parse(localStorage.getItem("config"));
  const [showAlert, setShowAlert] = useState("");

  const handleMenu = (menu) => {
    setMenu(menu);
  };
  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/";
  };
  return (
    <div className="container mx-auto">
      {/* Navbar */}
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <h1>
            <a className="btn btn-ghost text-xl inline">
              Wedding
              <FireIcon className="inline h-8 w-8 mb-2 text-orange-800" />
            </a>
          </h1>
        </div>
        <div className="flex-none">{dataUser.name}</div>
      </div>
      {/* Main */}
      <div className="grid md:grid-cols-4 pt-6">
        {/* Menu */}
        <div className="hidden md:block">
          <ul className="menu bg-base-200 rounded-box">
            <li className="mb-2">
              <a
                className={"" + (menu == "home" && "active")}
                onClick={() => handleMenu("home")}
              >
                <HomeIcon className="h-5 w-5 mb-1" />
                Home
              </a>
            </li>
            <li className="mb-2">
              <a
                className={"" + (menu == "guest" && "active")}
                onClick={() => handleMenu("guest")}
              >
                <BookOpenIcon className="h-5 w-5 mb-1" />
                Guest Book
              </a>
            </li>
            <li>
              <a
                className={"" + (menu == "setting" && "active")}
                onClick={() => handleMenu("setting")}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 mb-1" />
                Setting
              </a>
            </li>
          </ul>
          <hr className="my-2" />
          <ul className="menu bg-base-200 rounded-box">
            <li>
              <a
                className="hover:bg-red-500 hover:text-white"
                onClick={handleLogout}
              >
                <ArrowRightStartOnRectangleIcon className="h-5 w-5 mb-1" />
                Logout
              </a>
            </li>
          </ul>
        </div>
        {/* Content */}
        {menu == "home" && (
          <div className="col-span-3 px-4 pt-2">
            <div className="w-full rounded-xl bg-white text-gray-900 py-2 px-3 mb-6">
              Home
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-white mb-6">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-400 rounded-xl px-4 py-6">
                <div className="grid grid-cols-4">
                  <div className="col-span-3">
                    <p>
                      <strong>Comments</strong> <br /> 100
                    </p>
                  </div>
                  <div className="content-center">
                    <ChatBubbleLeftRightIcon className="h-8 w-8" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-500 to-blue-400 rounded-xl px-4 py-6">
                <div className="grid grid-cols-4">
                  <div className="col-span-3">
                    <p>
                      <strong>Present</strong> <br /> 100
                    </p>
                  </div>
                  <div className="content-center">
                    <CheckCircleIcon className="h-8 w-8" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-500 to-blue-400 rounded-xl px-4 py-6">
                <div className="grid grid-cols-4">
                  <div className="col-span-3">
                    <p>
                      <strong>Absent</strong> <br /> 100
                    </p>
                  </div>
                  <div className="content-center">
                    <XCircleIcon className="h-8 w-8" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-500 to-blue-400 rounded-xl px-4 py-6">
                <div className="grid grid-cols-4">
                  <div className="col-span-3">
                    <p>
                      <strong>Tentative</strong> <br /> 100
                    </p>
                  </div>
                  <div className="content-center">
                    <QuestionMarkCircleIcon className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 shadow-xl rounded-xl text-center">
              Yuk bagikan undangan ini biar banyak komentarnya
            </div>
          </div>
        )}
        {menu == "guest" && (
          <Guestbook setShowAlert={setShowAlert} dataUser={dataUser} />
        )}
        {menu == "setting" && (
          <div className="col-span-3 px-4 pt-2 pb-20">
            <div className="flex justify-between items-center w-full rounded-xl bg-white text-gray-900 py-1 px-3 mb-6">
              <p>Setting</p>
              <a
                href="/"
                target="_blank"
                className="btn btn-info btn-sm text-[#1d232a] rounded-badge"
              >
                Visit Web <ArrowUpRightIcon className="h-4 w-4 mb-1 inline" />
              </a>
            </div>
            {/* Change password */}
            <ChangePassword
              logout={handleLogout}
              setShowAlert={setShowAlert}
              dataUser={dataUser}
            />
            <General setShowAlert={setShowAlert} dataUser={dataUser} />
            <Foto setShowAlert={setShowAlert} dataUser={dataUser} />
            <Pengantin setShowAlert={setShowAlert} dataUser={dataUser} />
            <Gallery setShowAlert={setShowAlert} dataUser={dataUser} />
            <BankAccount setShowAlert={setShowAlert} dataUser={dataUser} />
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="md:hidden btm-nav text-xs border-t rounded-t-2xl shadow-inner">
        <button
          className="hover:text-slate-500"
          onClick={() => handleMenu("home")}
        >
          <HomeIcon className="h-4 md:h-5 w-4 md:w-5" />
          Home
        </button>
        <button
          className="hover:text-slate-500"
          onClick={() => handleMenu("guest")}
        >
          <BookOpenIcon className="h-4 md:h-5 w-4 md:w-5" />
          Guest Book
        </button>
        <button
          className="hover:text-slate-500"
          onClick={() => handleMenu("setting")}
        >
          <AdjustmentsHorizontalIcon className="h-4 md:h-5 w-4 md:w-5" />
          Setting
        </button>
      </div>
      {/* Alert */}
      {showAlert != "" && (
        <div
          role="alert"
          className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 alert fixed top-2 left-1/2 transform -translate-x-1/2 w-[80%] md:w-fit border-none text-white"
        >
          <div>
            <CheckCircleIcon className="h-5 w-5 mb-1 inline" />
            <span>{showAlert}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

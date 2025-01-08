import { useEffect, useState } from "react";
import {
  SunIcon,
  MoonIcon,
  HomeIcon,
  UsersIcon,
  CalendarDaysIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
function App() {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const [guest, setGuest] = useState(params.get("to"));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = "The Wedding";
  }, []);

  useEffect(() => {
    if (open) {
      console.log("convetti");
    }
  }, [open]);
  // use theme from local storage if available or set light theme
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  // update state on toggle
  const handleToggle = (e) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  // set theme state in localstorage on mount & also update localstorage on state change
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    // add custom data-theme attribute to html tag required to update theme using DaisyUI
    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);
  return (
    <div className="h-full min-h-full">
      <div
        className={
          open == true
            ? "hidden"
            : "hero min-h-full h-full pt-[20%] md:pt-[10%]"
        }
      >
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h2
              className="text-4xl font-esthetic mb-6 font-medium"
              style={{ fontSize: "40px" }}
            >
              The Wedding Of
            </h2>
            <div className="avatar mb-6">
              <div className="w-56 rounded-full border-4 border-white shadow-xl">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <h2
              className="text-4xl font-esthetic mb-6 font-medium"
              style={{ fontSize: "40px" }}
            >
              John & Jane
            </h2>
            {guest && (
              <>
                <p>Kepada Yth Bapak/Ibu/Saudara/i</p>
                <h2 className="text-3xl mb-6 font-medium">{guest}</h2>
              </>
            )}

            <button
              className="btn shadow-xl rounded-full"
              onClick={() => setOpen(!open)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill={theme == "dark" ? "white" : ""}
              >
                <path
                  fillRule="evenodd"
                  d="M2.106 6.447A2 2 0 0 0 1 8.237V16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.236a2 2 0 0 0-1.106-1.789l-7-3.5a2 2 0 0 0-1.788 0l-7 3.5Zm1.48 4.007a.75.75 0 0 0-.671 1.342l5.855 2.928a2.75 2.75 0 0 0 2.46 0l5.852-2.927a.75.75 0 1 0-.67-1.341l-5.853 2.926a1.25 1.25 0 0 1-1.118 0l-5.856-2.928Z"
                  clipRule="evenodd"
                />
              </svg>
              Open Invitation
            </button>
          </div>
        </div>
      </div>

      <div className={open == true ? "" : "hidden"}>
        {/* Floating Button */}
        <div className="fixed bottom-20 right-4 floating-btn">
          <button className="btn btn-square btn-sm font-bold rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-110 bounce relative">
            <label className="swap swap-rotate">
              <input
                type="checkbox"
                onChange={handleToggle}
                // show toggle image based on localstorage theme
                checked={theme === "light" ? false : true}
              />
              {/* light theme sun image */}
              <SunIcon className="w-5 h-5 swap-on" />
              {/* dark theme moon image */}
              <MoonIcon className="w-5 h-5 swap-off" />
            </label>
          </button>
        </div>
        {/* Bottom Navigation */}
        <div className="btm-nav text-xs border rounded-t-2xl shadow-inner z-50">
          <button className="hover:text-slate-500">
            <HomeIcon className="h-4 md:h-5 w-4 md:w-5" />
            Home
          </button>
          <button className="hover:text-slate-500">
            <UsersIcon className="h-4 md:h-5 w-4 md:w-5" />
            Mempelai
          </button>
          <button className="hover:text-slate-500">
            <CalendarDaysIcon className="h-4 md:h-5 w-4 md:w-5" />
            Tanggal
          </button>
          <button className="hover:text-slate-500">
            <PhotoIcon className="h-4 md:h-5 w-4 md:w-5" />
            Galeri
          </button>
          <button className="hover:text-slate-500">
            <ChatBubbleLeftRightIcon className="h-4 md:h-5 w-4 md:w-5" />
            Ucapan
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

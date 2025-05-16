import { useEffect, useRef, useState } from "react";
import {
  SunIcon,
  MoonIcon,
  HeartIcon,
  EyeIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");
import Wave from "../components/Wave";
import { Link } from "react-router-dom";

function Home() {
  const API = import.meta.env.VITE_API_URL;

  const scrollIntoView = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    document.title = `The Wedding`;
  }, []);
  // use theme from local storage if available or set light theme
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark"
  );

  // update state on toggle Theme
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

  const texts = [
    "Rasa pasti akan mengudara ketika jatuh cinta, tapi yang utama adalah menyikapinya, karena sebaik-baiknya cinta adalah pernikahan",
    "Pedekate tanpa perencanaan cuma bakal mengancam kesejahteraan, dibebani makin banyak modal akomodasi, belum lagi persaingan ketat karena sasaran tembak banyak peminat.",
    "Kalau belum ada niat dan belum siap, jangan buru-buru diungkap, Kamu kira gemuruh di dada akan reda setelah mengungkapkan rasa.",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1500, easing: "ease-out-cubic" });
    AOS.refresh();
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 7000);

    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, []);

  return (
    <>
      <div className="h-full min-h-full">
        <div>
          {/* Section 1 Home */}
          <section
            id="home"
            className="relative w-full h-auto md:h-[85vh] bg-cover bg-center"
          >
            <img
              src="/images/flower-r.png"
              className="absolute top-0 right-0 w-48 z-10 opacity-70"
              loading="lazy"
            />
            <div
              className={
                "absolute inset-0 bg-gradient-to-b " +
                (theme == "dark"
                  ? "from-gray-800 via-gray-800/50 to-gray-800"
                  : "from-gray-200 via-gray-200/50 to-gray-200")
              }
            ></div>
            <div className="relative z-10 flex justify-center h-full pt-4">
              <div
                className={
                  (theme == "dark" ? "text-white" : "text-gray-800") +
                  " max-w-md text-center relative"
                }
              >
                <h1
                  data-aos="fade-up"
                  className="text-4xl my-6 mt-8 font-medium"
                  style={{ fontSize: "40px" }}
                >
                  <Link to="/">Kabar Cinta</Link>
                </h1>
                <div data-aos="fade-up" className="avatar my-6 mx-4">
                  <div className="md:h-96 rounded-3xl border-2 border-orange-600 shadow-xl flex items-center justify-center">
                    <p
                      key={index}
                      data-aos="fade-up"
                      className="pt-12 md:pt-20 px-4 leading-[1.8]"
                    >
                      {texts[index]}
                    </p>
                  </div>
                </div>
                <div
                  data-aos="fade-up"
                  className="px-4 mb-2 -mt-24 md:-mt-28 w-full flex justify-center relative z-50"
                >
                  <img
                    src="/images/decor1.png"
                    loading="lazy"
                    alt=""
                    className="w-48 md:w-64"
                  />
                </div>
                <a
                  href="/demo"
                  target="_blank"
                  data-aos="fade-up"
                  className={
                    "btn shadow-xl rounded-2xl btn-outline mt-2 bounce-btn mr-2 " +
                    (theme == "dark" ? "text-white" : " ")
                  }
                >
                  <EyeIcon className="h-4" /> Preview
                </a>
                <Link
                  to="/auth"
                  data-aos="fade-up"
                  className="btn shadow-xl rounded-2xl btn-outline mt-2 bounce-btn bg-slate-500 text-white"
                >
                  <EnvelopeIcon className="h-4" />
                  Buat Undangan
                </Link>
              </div>
            </div>
          </section>

          {/* Section 8 footer */}
          <section
            className={
              "h-auto flex flex-col items-center relative overflow-hidden pt-10 md:pt-32 " +
              (theme == "dark" ? "bg-[#0b0f14]" : "bg-white")
            }
          >
            <Wave
              type="4"
              position="top"
              bgColor={theme == "dark" ? "#1f2937" : "#e5e7eb"}
            />
            <div
              className={
                "z-10 text-center w-full " +
                (theme == "dark" ? "text-white" : "text-gray-900")
              }
            >
              <div className="flex flex-col justify-center items-center">
                <div className="w-11/12 md:w-4/5 border-t my-4 mb-0 p-4 md:flex md:justify-between text-center">
                  <p className="text-sm">
                    Built With
                    <HeartIcon className="h-4 w-4 inline mb-2 mx-1 text-red-500" />
                    on Earth
                  </p>
                  <p className="text-sm">
                    <a
                      href="https://github.com/fauzifx"
                      target="_blank"
                      className="btn btn-link btn-sm inline px-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="20"
                        height="20"
                        viewBox="0 0 30 30"
                        fill={theme == "dark" ? "white" : "dark"}
                        className="inline mb-1"
                      >
                        <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                      </svg>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Floating Button */}
          <div className="fixed bottom-10 right-4 floating-btn z-50">
            <button className="btn btn-square btn-sm font-bold rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-110 bounce relative">
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  onChange={handleToggle}
                  checked={theme === "light" ? false : true}
                />
                {/* light theme sun image */}
                <SunIcon className="w-6 h-6 swap-on" />
                {/* dark theme moon image */}
                <MoonIcon className="w-6 h-6 swap-off" />
              </label>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

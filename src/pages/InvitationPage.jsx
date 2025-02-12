import React, { useState, useEffect, useRef } from "react";
import {
  SunIcon,
  MoonIcon,
  HomeIcon,
  UsersIcon,
  CalendarDaysIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  PauseCircleIcon,
  HeartIcon,
  PlayCircleIcon,
  EnvelopeOpenIcon,
} from "@heroicons/react/24/solid";
import Confetti from "react-confetti";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import AOS from "aos";
import "aos/dist/aos.css";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import FailedToLoad from "../components/FailedToLoad";
import useSWR, { useSWRConfig } from "swr";
import LoadingSekeletonPage from "../components/LoadingSekeletonPage";
import CountdownTimer from "../components/CountdownTimer";
import BankAccountList from "../components/BankAccountList";
import LoveAnimation from "../components/LoveAnimation";
import Wave from "../components/Wave";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import Cookies from "js-cookie";

function InvitationPage() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { url } = useParams();
  const [id, setId] = useState(
    Cookies.get("id") && JSON.parse(Cookies.get("id"))
  );
  const { mutate } = useSWRConfig();
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const [guest, setGuest] = useState(params.get("to"));
  const [open, setOpen] = useState(false);
  const [showConvetti, setShowConvetti] = useState(false);
  const audio = document.getElementById("audio_tag");
  const [play, setPlay] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark"
  );
  const [placehold, setPlacehold] = useState([
    { url: "https://placehold.co/300x200?text=1" },
    { url: "https://placehold.co/300x200?text=2" },
    { url: "https://placehold.co/300x200?text=3" },
  ]);

  // useRef Section
  const home = useRef(null);
  const mempelai = useRef(null);
  const tanggal = useRef(null);
  const galeri = useRef(null);
  const ucapan = useRef(null);
  const daftarKomentar = useRef(null);

  // Scroll intoView
  const scrollIntoView = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  const handleToggle = (e) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  // Comment
  const dataUser = {
    uuid: uuidv4(),
    name: "",
    presence: "",
  };
  const [user, setUser] = useState(
    Cookies.get("user") ? JSON.parse(Cookies.get("user")) : dataUser
  );

  useEffect(() => {
    Cookies.set("user", JSON.stringify(user), {
      expires: 30,
      path: `/${url}`,
    });
  }, [user]);

  const handleSubmitComment = async (comment) => {
    try {
      setLoadingComment(true);
      const response = await api.post(API + "/comment", {
        uuid: user.uuid,
        name: comment.name,
        text: comment.text,
        presence: comment.presence,
        parentId: null,
        userId: id.userId,
        urlId: id.urlId,
      });

      if (response.data.success) {
        mutate("/v1/get/comment");
        const LS = {
          uuid: user.uuid,
          name: comment.name,
          presence: comment.presence,
        };
        Cookies.set("user", JSON.stringify(LS), {
          expires: 30,
          path: `/${url}`,
        });
        setUser(LS);
        scrollIntoView(daftarKomentar);
        setLoadingComment(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComment = async () => {
    try {
      const response = await api.get(API + "/comment/" + url);
      const data = response.data.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleReply = async (parentId, text) => {
    try {
      await api.post(API + "/comment", {
        uuid: user.uuid,
        name: user.name,
        text: text,
        presence: user.presence,
        parentId: parentId,
        userId: id.userId,
        urlId: id.urlId,
      });
      mutate("/v1/get/comment");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (id, text) => {
    try {
      await api.patch(API + "/comment/" + id, {
        text: text,
      });
      mutate("/v1/get/comment");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingDelete(true);
      await api.delete(API + "/comment/" + id);
      mutate("/v1/get/comment");
      setLoadingDelete(false);
    } catch (error) {
      console.log(error);
    }
  };
  // ./ Comment

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    // add custom data-theme attribute to html tag required to update theme using DaisyUI
    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);

  useEffect(() => {
    document.title = `The Wedding`;
    if (open) {
      setPlay(true);
      audio.play();
      AOS.init({ duration: 1000, easing: "ease-out-cubic" });
      AOS.refresh();
      setShowConvetti(true);
      const timer = setTimeout(() => {
        setShowConvetti(false);
      }, 35000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const fetcher = async () => {
    try {
      const response = await api.get(
        API + "/invitation/" + url + "?include=true"
      );
      const data = response.data.data;
      if (!data) {
        navigate("/");
      }
      const dataId = {
        urlId: data.id,
        url: data.url,
        userId: data.userId,
      };

      Cookies.set("id", JSON.stringify(dataId), {
        path: `/${url}`,
      });

      const pengantin1 = data.person.find((e) => e.pos == 1); //Pos 1
      const pengantin2 = data.person.find((e) => e.pos == 2); //Pos 2

      const result = {
        general: data.general,
        pengantin1: pengantin1,
        pengantin2: pengantin2,
        gallery: data.gallery,
        bank: data.bankaccount,
      };

      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, isLoading } = useSWR("/v1/get/invitation", fetcher);
  const {
    data: comments,
    error: errorComment,
    isLoading: isLoadingComment,
  } = useSWR("/v1/get/comment", fetchComment);

  if (error || errorComment) return <FailedToLoad />;
  if (isLoading || isLoadingComment) return <LoadingSekeletonPage />;

  return (
    <>
      <audio
        id="audio_tag"
        src={
          data.general.music
            ? API + "/music/" + data.general.music
            : "https://thetestdata.com/assets/audio/mp3/thetestdata-sample-mp3-8.mp3"
        }
      />
      {showConvetti && (
        <Confetti
          style={{ zIndex: 9999, position: "fixed", top: 0, left: 0 }}
          numberOfPieces={150}
          opacity={0.5}
          gravity={0.06}
          drawShape={(ctx) => {
            ctx.beginPath();
            ctx.moveTo(0, -5); // Top point
            ctx.lineTo(5, 0); // Right point
            ctx.lineTo(0, 5); // Bottom point
            ctx.lineTo(-5, 0); // Left point
            ctx.closePath();
            ctx.fill();
          }}
          height={window.innerHeight}
          colors={["#4C0606", "#86003C", "#E41F7B", "#FF8BA0", "#FFB6B3"]}
        />
      )}

      <div className="h-full min-h-full">
        {/* Opening */}
        <div
          className={
            "hero min-h-full relative h-screen " +
            (open == true && "hidden ") +
            (theme == "dark" ? "bg-[#0b0f14]" : "bg-white")
          }
        >
          <img
            src="/images/flower-r.png"
            className="absolute top-0 right-0 w-56 md:w-96 opacity-70"
            loading="lazy"
          />
          <img
            src="/images/flower-l.png"
            className="absolute bottom-0 left-0 w-72 md:w-96 opacity-70"
            loading="lazy"
          />
          <div className="hero-content text-center">
            <div
              className={
                (theme == "dark" ? "text-white" : "text-gray-800") + " max-w-md"
              }
            >
              <h2
                className="text-4xl font-esthetic mb-2 font-medium"
                style={{ fontSize: "40px" }}
              >
                The Wedding Of
              </h2>
              <div className="avatar mb-1">
                <div className="w-56 rounded-full border-2 border-orange-600 shadow-2xl">
                  <img
                    src={
                      data.general.image
                        ? API + "/images/" + data.general.image
                        : "https://placehold.co/200x200?text=Image"
                    }
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="px-4 mb-2 -mt-24 w-full flex justify-center relative z-50">
                <img
                  src="/images/decor1.png"
                  loading="lazy"
                  alt=""
                  className="w-56"
                />
              </div>
              <h2
                className="text-4xl font-esthetic mb-4 font-medium"
                style={{ fontSize: "40px" }}
              >
                {data.pengantin1.name || "{Name}"}
                <p className="text-6xl md:inline px-4">&</p>
                {data.pengantin2.name || "{Name}"}
              </h2>
              <p>Kepada Yth Bapak/Ibu/Saudara/i</p>
              {guest && (
                <h2 className="text-2xl md:text-3xl mb-2 font-medium">
                  {guest}
                </h2>
              )}

              <button
                className={
                  "btn shadow-xl rounded-full btn-outline mt-2 bounce-btn " +
                  (theme == "dark" ? "text-white" : " ")
                }
                onClick={() => setOpen(!open)}
              >
                <EnvelopeOpenIcon className="h-5 w-5 mb-1" />
                Open Invitation
              </button>
            </div>
          </div>
        </div>

        <div className={open == true ? "" : "hidden"}>
          {/* Section 1 Home */}
          <section
            ref={home}
            id="home"
            className="relative w-full h-auto md:h-[85vh] bg-cover bg-center"
            style={{
              backgroundImage: `url('${
                data.general.bg_image
                  ? API + "/images/" + data.general.bg_image
                  : "https://placehold.co/400x400?text=BgImage"
              }')`,
            }}
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
                data-aos="zoom-in-up"
                className={
                  (theme == "dark" ? "text-white" : "text-gray-800") +
                  " max-w-md text-center relative"
                }
              >
                <h2
                  className="text-4xl font-esthetic my-6 font-medium"
                  style={{ fontSize: "40px" }}
                >
                  Undangan Pernikahan
                </h2>
                <div className="avatar my-6">
                  <div className="w-56 rounded-full border-2 border-orange-600 shadow-xl">
                    <img
                      src={
                        data.general.image
                          ? API + "/images/" + data.general.image
                          : "https://placehold.co/200x200?text=Image"
                      }
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="px-4 mb-2 -mt-28 w-full flex justify-center relative z-50">
                  <img
                    src="/images/decor1.png"
                    loading="lazy"
                    alt=""
                    className="w-56"
                  />
                </div>
                <h2
                  className="text-4xl font-esthetic my-2 md:my-6 font-medium"
                  style={{ fontSize: "40px" }}
                >
                  {data.pengantin1.name || "{Name}"}
                  <p className="px-4 md:inline">&</p>
                  {data.pengantin2.name || "{Name}"}
                </h2>
                <h2 className="text-2xl my-6 font-medium">
                  {data.general.date
                    ? dayjs(data.general.date)
                        .tz("Asia/Jakarta")
                        .format("dddd, DD MMMM YYYY")
                    : "{Date}"}
                </h2>
                <p className="py-2">Scroll Down</p>
                <div className="flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="animate-bounce w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.47 13.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 0 0-1.06-1.06L12 11.69 5.03 4.72a.75.75 0 0 0-1.06 1.06l7.5 7.5Z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M11.47 19.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 1 0-1.06-1.06L12 17.69l-6.97-6.97a.75.75 0 0 0-1.06 1.06l7.5 7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 Mempelai */}
          <section
            ref={mempelai}
            className={
              "h-auto flex flex-col items-center relative overflow-hidden pb-10 " +
              (theme == "dark" ? "bg-[#0b0f14]" : "bg-white")
            }
          >
            {/* Love Animation */}
            <div>
              <LoveAnimation position="top-[40%] right-[5%]" type="1" />
              <LoveAnimation position="top-[50%] left-[5%]" type="2" />
              <LoveAnimation position="top-[65%] right-[5%]" type="4" />
              <LoveAnimation position="top-[85%] left-[5%]" type="3" />
            </div>
            <Wave
              position="top"
              type="1"
              bgColor={theme == "dark" ? "#1f2937" : "#e5e7eb"}
            />
            <div
              className={
                "z-10 pt-20 md:mt-56 text-center " +
                (theme == "dark" ? "text-white" : "text-gray-900")
              }
            >
              <h2 className="text-3xl font-arabic py-4">
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </h2>
              <h2 className="text-3xl font-esthetic py-4">
                Assalamualaikum Warahmatullahi Wabarakatuh
              </h2>
              <p className="py-4 px-2">
                Tanpa mengurangi rasa hormat, kami mengundang Anda untuk
                berkenan menghadiri acara pernikahan kami:
              </p>
              <div data-aos="fade-right" className="avatar my-5">
                <div className="w-56 rounded-full border-4 border-white shadow-xl">
                  <img
                    src={
                      data.pengantin1.image
                        ? API + "/images/" + data.pengantin1.image
                        : "https://placehold.co/200x200?text=Img1"
                    }
                    loading="lazy"
                  />
                </div>
              </div>
              <div data-aos="fade-down">
                <h2 className="text-4xl font-esthetic py-2 capitalize">
                  {data.pengantin1.name || "{Name}"}
                </h2>
                <p className="pt-4 text-lg">
                  Putra ke {data.pengantin1.child_number || "{Number}"}
                </p>
                <p className="pb-4 capitalize">
                  Bapak {data.pengantin1.father || "{Name}"}
                  <span className="lowercase"> dan </span>
                  Ibu {data.pengantin1.mother || "{Name}"}
                </p>
              </div>
              <h1 className="text-6xl font-esthetic py-5">&</h1>
              <div data-aos="fade-left" className="avatar my-5">
                <div className="w-56 rounded-full border-4 border-white shadow-xl">
                  <img
                    src={
                      data.pengantin2.image
                        ? API + "/images/" + data.pengantin2.image
                        : "https://placehold.co/200x200?text=Img2"
                    }
                    loading="lazy"
                  />
                </div>
              </div>
              <div data-aos="fade-down">
                <h2 className="text-4xl font-esthetic py-2 capitalize">
                  {data.pengantin2.name || "{Name}"}
                </h2>
                <p className="pt-4 text-lg">
                  Putra ke {data.pengantin2.child_number || "{Number}"}
                </p>
                <p className="pb-4 capitalize">
                  Bapak {data.pengantin2.father || "{Name}"}
                  <span className="lowercase"> dan </span>
                  Ibu {data.pengantin2.mother || "{Name}"}
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 Ayat */}
          <section
            className={
              "h-auto flex flex-col items-center relative overflow-hidden pt-20 pb-6 md:pt-32 md:pb-8 " +
              (theme == "dark" ? "bg-[#1f2937]" : "bg-[#e5e7eb]")
            }
          >
            <Wave
              type="4"
              position="top"
              bgColor={theme == "dark" ? "#0b0f14" : "#ffffff"}
            />
            <div
              className={
                "z-10 text-center w-full " +
                (theme == "dark" ? "text-white" : "text-gray-900")
              }
            >
              <h2 className="text-3xl font-esthetic py-4 px-2">
                Allah Subhanahu Wa Ta&apos;ala berfirman
              </h2>
              <div className="flex flex-col justify-center items-center">
                <div
                  data-aos="fade-up"
                  className={
                    "w-11/12 md:w-4/5 rounded-lg shadow-2xl my-4 p-4 " +
                    (theme == "dark" ? "bg-gray-700" : "bg-white")
                  }
                >
                  <p>
                    Dan segala sesuatu Kami ciptakan berpasang-pasangan agar
                    kamu mengingat (kebesaran Allah). <br /> <br />
                    <u>QS. Adh-Dhariyat: 49</u>
                  </p>
                </div>
                <div
                  data-aos="fade-up"
                  className={
                    "w-11/12 md:w-4/5 rounded-lg shadow-xl my-4 p-4 " +
                    (theme == "dark" ? "bg-gray-700" : "bg-white")
                  }
                >
                  <p>
                    dan sesungguhnya Dialah yang menciptakan pasangan laki-laki
                    dan perempuan, <br /> <br />
                    <u>QS. An-Najm: 45</u>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 Tanggal */}
          <section
            ref={tanggal}
            className={
              "h-auto flex flex-col items-center relative overflow-hidden pt-32 md:pt-56 " +
              (theme == "dark" ? "bg-[#0b0f14]" : "bg-white")
            }
          >
            {/* Love Animation */}
            <div>
              <LoveAnimation position="top-[40%] right-[5%]" type="1" />
              <LoveAnimation position="top-[50%] left-[5%]" type="2" />
              <LoveAnimation position="top-[63%] right-[5%]" type="4" />
              <LoveAnimation
                position="top-[95%] md:top-[85%] left-[5%]"
                type="3"
              />
            </div>
            <Wave
              type="1"
              position="top"
              bgColor={theme == "dark" ? "#1f2937" : "#e5e7eb"}
            />
            <div
              className={
                "z-10 text-center w-full mb-10 " +
                (theme == "dark" ? "text-white" : "text-gray-900")
              }
            >
              <h1 className="font-esthetic text-4xl md:text-5xl">
                Moment Bahagia
              </h1>
            </div>
            <div
              className={
                "text-center border border-gray-300 shadow-xl rounded-full w-11/12 md:w-4/5 grid grid-cols-4 mb-4 " +
                (theme == "dark" ? "text-white" : "text-gray-900")
              }
            >
              {/* Countdown */}
              <CountdownTimer
                date={data.general.date}
                time={data.general.time}
              />
            </div>
            <div
              className={
                "z-10 text-center w-full mb-10 " +
                (theme == "dark" ? "text-white" : "text-gray-900")
              }
            >
              <p className="p-4">
                Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta&apos;ala,
                insyaAllah kami akan menyelenggarakan acara:
              </p>
              <h2 data-aos="fade-down" className="text-3xl font-esthetic py-4">
                Akad & Resepsi
              </h2>
              <div data-aos="fade-left">
                <p className="py-2 text-xl">
                  {data.general.date
                    ? dayjs(data.general.date).tz("Asia/Jakarta").format("dddd")
                    : "{Days}"}
                </p>
                <p className="text-xl">
                  {data.general.date
                    ? dayjs(data.general.date)
                        .tz("Asia/Jakarta")
                        .format("DD MMMM YYYY")
                    : "{Date}"}
                </p>
              </div>
              <div data-aos="fade-right">
                <p className="py-2 text-xl">Pukul</p>
                <p className="text-xl pb-4">
                  {data.general.time
                    ? data.general.time.substring(0, 5)
                    : "{Time}"}{" "}
                  WIB - Selesai
                </p>
              </div>
              <img
                className="mx-auto h-20"
                src="/images/flower-decor.png"
                loading="lazy"
              />
              <div data-aos="fade-down">
                <h2 className="text-3xl font-esthetic py-4">Bertempat Di</h2>
                <p className="capitalize">
                  {data.general.address || "{Address}"}
                </p>
                <a
                  href={data.general.maps || "https://www.google.co.id/maps"}
                  target="_blank"
                  className={
                    "btn btn-outline btn-sm rounded-full shadow-xl my-4 " +
                    (theme == "dark" ? "text-white" : "")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Lihat Google Maps
                </a>
              </div>
              <p className="py-4 px-2">
                Merupakan suatu kebahagiaan dan kehormatan bagi kami, <br />
                apabila Bapak/Ibu/Saudara/i, berkenan hadir untuk memberikan doa
                restu kepada putra-putri kami.
              </p>
              <p className="p-3">
                Atas kehadiran dan doa restunya kami ucapkan terima kasih.
              </p>
            </div>
          </section>

          {/* Section 5 Galeri */}
          <section
            ref={galeri}
            className={
              "h-auto flex flex-col items-center relative overflow-hidden pb-10 px-2 " +
              (theme == "dark" ? "bg-[#0b0f14]" : "bg-white")
            }
          >
            <div className="w-[99%] md:w-[80%] border border-gray-300 shadow-xl rounded-badge pt-8 pb-2 md:pb-8 md:py-10 px-2 md:px-20">
              <div
                className={
                  "z-10 text-center w-full mb-10 " +
                  (theme == "dark" ? "text-white" : "text-gray-900")
                }
              >
                <h1 className="font-esthetic text-4xl md:text-5xl">Galeri</h1>
              </div>
              <div data-aos="zoom-in-up">
                <Carousel>
                  {data.gallery.length != 0
                    ? data.gallery.map(({ image }, key) => (
                        <div key={key}>
                          <img
                            src={API + "/images/" + image}
                            loading="lazy"
                            className="rounded-xl"
                          />
                        </div>
                      ))
                    : placehold.map(({ url }, key) => (
                        <div key={key}>
                          <img
                            src={url}
                            loading="lazy"
                            className="rounded-xl"
                          />
                        </div>
                      ))}
                </Carousel>
              </div>
              <br />
            </div>
          </section>

          {/* Section 6 Gift */}
          <section
            className={
              "h-auto flex flex-col items-center relative overflow-hidden pt-20 pb-10 md:pt-32 " +
              (theme == "dark" ? "bg-[#1f2937]" : "bg-[#e5e7eb]")
            }
          >
            <Wave
              type="4"
              position="top"
              bgColor={theme == "dark" ? "#0b0f14" : "#ffffff"}
            />
            <div
              className={
                "z-10 text-center w-full mb-10 " +
                (theme == "dark" ? "text-white" : "text-gray-900")
              }
            >
              <h1 className="font-esthetic text-4xl md:text-5xl py-4">
                Wedding Gift
              </h1>
              <p className="pt-4">
                Dengan hormat, bagi Anda yang ingin memberikan tanda kasih
                kepada kami, dapat melalui:
              </p>
            </div>

            {data.bank && <BankAccountList data={data.bank} theme={theme} />}
          </section>
          {/* Section 7 Comment Form */}
          <section
            ref={ucapan}
            className={
              "w-full h-auto flex flex-col items-center relative overflow-hidden pb-2 " +
              (theme == "dark" ? "bg-[#1f2937]" : "bg-[#e5e7eb]")
            }
          >
            <div
              className={
                "z-10 text-center w-full " +
                (theme == "dark" ? "text-white" : "text-gray-900")
              }
            >
              <div className="flex flex-col justify-center items-center">
                <div
                  className={
                    "border border-gray-300 rounded-badge w-11/12 md:w-4/5 shadow-xl my-4 p-4 " +
                    (theme == "light" && "bg-white")
                  }
                >
                  <h1 className="font-esthetic text-4xl md:text-5xl py-4">
                    Ucapan & Doa
                  </h1>
                  <CommentForm
                    onSubmit={handleSubmitComment}
                    name={guest || ""}
                    isLoading={loadingComment}
                  />
                </div>
                {/* Pagination */}
                {/* <div className="join rounded-xl my-4">
                  <button className="join-item btn">
                    <ChevronDoubleLeftIcon className="h-5 w-5" />
                  </button>
                  <button className="join-item btn">Page 1</button>
                  <button className="join-item btn">
                    <ChevronDoubleRightIcon className="h-5 w-5" />
                  </button>
                </div> */}
              </div>
            </div>
          </section>

          {/* Comment List */}
          <section
            ref={daftarKomentar}
            className={
              "w-full h-auto flex flex-col items-center relative overflow-hidden pb-10 " +
              (theme == "dark" ? "bg-[#1f2937]" : "bg-[#e5e7eb]")
            }
          >
            {/* Comment List */}
            <CommentList
              comments={comments}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentUserId={user.uuid}
              theme={theme}
              loadingDelete={loadingDelete}
            />
          </section>

          {/* Section 8 footer */}
          <section
            className={
              "h-auto flex flex-col items-center relative overflow-hidden pt-10 md:pt-32 pb-10 " +
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
                <div className="w-11/12 md:w-4/5 mt-4 p-4">
                  <p>
                    Terima kasih atas perhatian dan doa restu Anda, yang menjadi
                    kebahagiaan serta kehormatan besar bagi kami.
                  </p>
                  <h2 className="py-4 font-esthetic text-3xl md:text-4xl">
                    Wassalamualaikum Warahmatullahi Wabarakatuh
                  </h2>
                  <div className="py-4 text-2xl md:text-3xl font-arabic">
                    اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ
                  </div>
                </div>
                <div className="w-11/12 md:w-4/5 border-t my-4 p-4 md:flex md:justify-between text-center">
                  <p className="text-sm">
                    Build With
                    <HeartIcon className="h-4 w-4 inline mb-2 mx-1 text-red-500" />
                    Ahmad Fauzi
                  </p>
                  <p className="text-sm">
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
                    <a
                      href="https://github.com/fauzifx"
                      target="_blank"
                      className="btn btn-link btn-sm inline px-1"
                    >
                      FauziFx
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Floating Button */}
          <div className="fixed bottom-20 right-4 floating-btn z-50">
            <button
              onClick={() => {
                play ? setPlay(false) : setPlay(true);
                play ? audio.pause() : audio.play();
              }}
              className="btn btn-square btn-sm font-bold rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-110 bounce relative"
            >
              {play == true ? (
                <PauseCircleIcon className="h-5 w-5 rotate-animation" />
              ) : (
                <PlayCircleIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="fixed bottom-32 right-4 floating-btn z-50">
            <button className="btn btn-square btn-sm font-bold rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-110 bounce relative">
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  onChange={handleToggle}
                  // show toggle image based on localstorage theme
                  checked={theme === "light" ? false : true}
                />
                {/* light theme sun image */}
                <SunIcon className="w-6 h-6 swap-on" />
                {/* dark theme moon image */}
                <MoonIcon className="w-6 h-6 swap-off" />
              </label>
            </button>
          </div>
          {/* Bottom Navigation */}
          <div
            className="btm-nav text-xs border-t rounded-t-2xl shadow-inner z-50"
            style={{
              backgroundColor:
                theme == "dark"
                  ? "rgb(33 37 41 / 90%)"
                  : "rgb(249 250 250 / 90%)",
            }}
          >
            <button
              className="hover:text-slate-500"
              onClick={() => scrollIntoView(home)}
            >
              <HomeIcon className="h-4 md:h-5 w-4 md:w-5" />
              Home
            </button>
            <button
              className="hover:text-slate-500"
              onClick={() => scrollIntoView(mempelai)}
            >
              <UsersIcon className="h-4 md:h-5 w-4 md:w-5" />
              Mempelai
            </button>
            <button
              className="hover:text-slate-500"
              onClick={() => scrollIntoView(tanggal)}
            >
              <CalendarDaysIcon className="h-4 md:h-5 w-4 md:w-5" />
              Tanggal
            </button>
            <button
              className="hover:text-slate-500"
              onClick={() => scrollIntoView(galeri)}
            >
              <PhotoIcon className="h-4 md:h-5 w-4 md:w-5" />
              Galeri
            </button>
            <button
              className="hover:text-slate-500"
              onClick={() => scrollIntoView(ucapan)}
            >
              <ChatBubbleLeftRightIcon className="h-4 md:h-5 w-4 md:w-5" />
              Ucapan
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default InvitationPage;

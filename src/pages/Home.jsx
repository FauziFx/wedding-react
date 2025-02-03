import { useEffect, useRef, useState } from "react";
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
  MusicalNoteIcon,
  PlayCircleIcon,
  EnvelopeOpenIcon,
} from "@heroicons/react/24/solid";
import Confetti from "react-confetti";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import AOS from "aos";
import "aos/dist/aos.css";
import api from "../utils/api";
import dayjs from "dayjs";
import useSWR, { useSWRConfig } from "swr";
import FailedToLoad from "../components/FailedToLoad";
import LoadingSekeleton from "../components/LoadingSekeleton";
import LoadingSekeletonPage from "../components/LoadingSekeletonPage";
import "dayjs/locale/id";
dayjs.locale("id");
import { v4 as uuidv4 } from "uuid";
import CountdownTimer from "../components/CountdownTimer";
import BankAccountList from "../components/BankAccountList";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

function Home() {
  const API = import.meta.env.VITE_API_URL;
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
  const dataUser = {
    uuid: uuidv4(),
    name: "",
    presence: "",
  };
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : dataUser
  );

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
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
      });

      if (response.data.success) {
        mutate("/v1/get/comment");
        const LS = {
          uuid: user.uuid,
          name: comment.name,
          presence: comment.presence,
        };
        localStorage.setItem("user", JSON.stringify(LS));
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
      const response = await api.get(API + "/comment");
      return response.data.data;
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

  // useRef Section
  const home = useRef(null);
  const mempelai = useRef(null);
  const tanggal = useRef(null);
  const galeri = useRef(null);
  const ucapan = useRef(null);
  const daftarKomentar = useRef(null);

  const scrollIntoView = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    document.title = `The Wedding`;
    if (open) {
      setPlay(true);
      audio.play();
      AOS.init({ duration: 1500, easing: "ease-out-cubic" });
      AOS.refresh();
      setShowConvetti(true);
      const timer = setTimeout(() => {
        setShowConvetti(false);
      }, 35000);
      return () => clearTimeout(timer);
    }
  }, [open]);
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

  const fetcher = async () => {
    try {
      const generalRes = await api.get(API + "/general");
      const pengantinRes = await api.get(API + "/person");
      const galleryRes = await api.get(API + "/gallery");
      const bankRes = await api.get(API + "/bankaccount");

      const [general] = generalRes.data.data;
      const pengantin = pengantinRes.data.data;
      const gallery = galleryRes.data.data;
      const bank = bankRes.data.data;

      const pengantin1 = pengantin.find((e) => e.pos == 1); //Pos 1
      const pengantin2 = pengantin.find((e) => e.pos == 2); //Pos 2

      const data = {
        general: general,
        pengantin1: pengantin1,
        pengantin2: pengantin2,
        gallery: gallery,
        bank: bank,
      };

      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const { data: comments } = useSWR("/v1/get/comment", fetchComment);
  const { data, error, isLoading } = useSWR("/v1/get/home", fetcher);

  if (error) return <FailedToLoad />;
  if (isLoading) return <LoadingSekeletonPage />;

  return (
    <>
      <audio id="audio_tag" src={API + "/music/" + data.general.music} />
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
            "hero min-h-full h-screen pt-[15%] md:pt-[5%] " +
            (open == true && "hidden ") +
            (theme == "dark" ? "bg-[#0b0f14]" : "bg-white")
          }
        >
          <img
            src={"/images/" + (theme == "dark" ? "decor-w.png" : "decor-b.png")}
            loading="lazy"
            alt=""
            className="absolute top-2 md:top-10 left-1/2 transform -translate-x-1/2 rotate-180 w-[75%] md:w-[30%]"
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
              <div className="avatar mb-1 z-50">
                <div className="w-56 rounded-full border-4 border-white shadow-2xl">
                  <img
                    src={API + "/images/" + data.general.image}
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="bottom-0 left-0 px-4 mb-2 -mt-7">
                <img
                  src={
                    "/images/" +
                    (theme == "dark" ? "decor-w.png" : "decor-b.png")
                  }
                  loading="lazy"
                  alt=""
                />
              </div>
              <h2
                className="text-4xl font-esthetic mb-4 font-medium"
                style={{ fontSize: "40px" }}
              >
                {data.pengantin1.name}
                <p className="text-6xl md:inline px-4">&</p>
                {data.pengantin2.name}
              </h2>
              <p>Kepada Yth Bapak/Ibu/Saudara/i</p>
              {guest && (
                <h2 className="text-2xl md:text-3xl mb-2 font-medium">
                  {guest}
                </h2>
              )}

              <button
                className="btn shadow-xl rounded-full btn-outline mt-2"
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
                API + "/images/" + data.general.bg_image
              }')`,
            }}
          >
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
                  " max-w-md text-center"
                }
              >
                <h2
                  className="text-4xl font-esthetic my-6 font-medium"
                  style={{ fontSize: "40px" }}
                >
                  Undangan Pernikahan
                </h2>
                <div className="avatar my-6">
                  <div className="w-56 rounded-full border-4 border-white shadow-xl">
                    <img
                      src={API + "/images/" + data.general.image}
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="bottom-0 left-0 px-4 mb-2 -mt-12">
                  <img
                    src={
                      "/images/" +
                      (theme == "dark" ? "decor-w.png" : "decor-b.png")
                    }
                    loading="lazy"
                    alt=""
                  />
                </div>
                <h2
                  className="text-4xl font-esthetic my-2 md:my-6 font-medium"
                  style={{ fontSize: "40px" }}
                >
                  {data.pengantin1.name}
                  <p className="px-4 md:inline">&</p>
                  {data.pengantin2.name}
                </h2>
                <h2 className="text-2xl my-6 font-medium">
                  {dayjs(data.general.date)
                    .tz("Asia/Jakarta")
                    .format("dddd, DD MMMM YYYY")}
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
                    src={API + "/images/" + data.pengantin1.image}
                    loading="lazy"
                  />
                </div>
              </div>
              <div data-aos="fade-down">
                <h2 className="text-4xl font-esthetic py-2 capitalize">
                  {data.pengantin1.name}
                </h2>
                <p className="pt-4 text-lg">
                  Putra ke {data.pengantin1.child_number}
                </p>
                <p className="pb-4 capitalize">
                  Bapak {data.pengantin1.father}
                  <span className="lowercase"> dan </span>
                  Ibu {data.pengantin1.mother}
                </p>
              </div>
              <h2 className="text-6xl font-esthetic py-5">&</h2>
              <div data-aos="fade-left" className="avatar my-5">
                <div className="w-56 rounded-full border-4 border-white shadow-xl">
                  <img
                    src={API + "/images/" + data.pengantin2.image}
                    loading="lazy"
                  />
                </div>
              </div>
              <div data-aos="fade-down">
                <h2 className="text-4xl font-esthetic py-2 capitalize">
                  {data.pengantin2.name}
                </h2>
                <p className="pt-4 text-lg">
                  Putra ke {data.pengantin2.child_number}
                </p>
                <p className="pb-4 capitalize">
                  Bapak {data.pengantin2.father}
                  <span className="lowercase"> dan </span>
                  Ibu {data.pengantin2.mother}
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
                  {dayjs(data.general.date).tz("Asia/Jakarta").format("dddd")}
                </p>
                <p className="text-xl">
                  {dayjs(data.general.date)
                    .tz("Asia/Jakarta")
                    .format("DD MMMM YYYY")}
                </p>
              </div>
              <div data-aos="fade-right">
                <p className="py-2 text-xl">Pukul</p>
                <p className="text-xl pb-4">
                  {data.general.time.substring(0, 5)} WIB - Selesai
                </p>
              </div>
              <div data-aos="fade-down">
                <h2 className="text-3xl font-esthetic py-4">Bertempat Di</h2>
                <p className="capitalize">{data.general.address}</p>

                <a
                  href={data.general.maps}
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
            <div className="md:w-[80%] border border-gray-300 shadow-xl rounded-badge pt-8 pb-2 md:pb-8 px-2 md:py-10 md:px-20">
              <div
                className={
                  "z-10 text-center w-full mb-10 " +
                  (theme == "dark" ? "text-white" : "text-gray-900")
                }
              >
                <h1 className="font-esthetic text-4xl md:text-5xl">Galeri</h1>
              </div>
              <div data-aos="fade-up">
                <Carousel>
                  {data.gallery.map(({ image }, key) => (
                    <div key={key}>
                      <img
                        src={API + "/images/" + image}
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
            <BankAccountList data={data.bank} theme={theme} />
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
                    name={guest}
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
                    {/* <MusicalNoteIcon className="h-3 w-3 mb-1 inline" /> */}
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

function LoveAnimation({ position, type }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="42"
      fill="currentColor"
      className={"absolute bounce-slow-" + type + " " + position}
      viewBox="0 0 16 16"
    >
      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"></path>
    </svg>
  );
}

function Wave({ type, position, bgColor }) {
  return (
    <svg
      className={
        "absolute left-0 " +
        (position == "top" ? "top-0" : "bottom-0 rotate-180")
      }
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 300"
    >
      <path
        fill={bgColor}
        fillOpacity="1"
        d={
          type == 1
            ? "M0,128L40,112C80,96,160,64,240,80C320,96,400,160,480,160C560,160,640,96,720,106.7C800,117,880,203,960,213.3C1040,224,1120,160,1200,122.7C1280,85,1360,75,1400,69.3L1440,64L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
            : type == 2
            ? "M0,160L40,133.3C80,107,160,53,240,53.3C320,53,400,107,480,149.3C560,192,640,224,720,202.7C800,181,880,107,960,90.7C1040,75,1120,117,1200,117.3C1280,117,1360,75,1400,53.3L1440,32L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
            : type == 3
            ? "M0,64L40,58.7C80,53,160,43,240,74.7C320,107,400,181,480,181.3C560,181,640,107,720,85.3C800,64,880,96,960,101.3C1040,107,1120,85,1200,96C1280,107,1360,149,1400,170.7L1440,192L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
            : type == 4
            ? "M0,32L60,58.7C120,85,240,139,360,133.3C480,128,600,64,720,58.7C840,53,960,107,1080,122.7C1200,139,1320,117,1380,106.7L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            : "M0,160L48,138.7C96,117,192,75,288,53.3C384,32,480,32,576,53.3C672,75,768,117,864,112C960,107,1056,53,1152,69.3C1248,85,1344,171,1392,213.3L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        }
      ></path>
    </svg>
  );
}

export default Home;

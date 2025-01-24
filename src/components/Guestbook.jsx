import React, { useState } from "react";
import { PaperAirplaneIcon, UserIcon } from "@heroicons/react/24/solid";
import api from "../utils/api";
import LoadingSekeleton from "./LoadingSekeleton";
import FailedToLoad from "./FailedToLoad";
import useSWR, { useSWRConfig } from "swr";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

function Guestbook({ setShowAlert }) {
  const API = import.meta.env.VITE_API_URL;
  const { mutate } = useSWRConfig();
  const decode = jwtDecode(Cookies.get("token"));
  const [linkWA, setLinkWA] = useState("");
  const [message, setMessage] = useState("");
  const [copy, setCopy] = useState(false);
  const [undangan, setUndangan] = useState({
    to: "",
    link: "",
    phone: "",
    mempelai: "John Doe & Jane Doe",
  });
  const [guest, setGuest] = useState({
    name: "",
    whatsapp: "",
    userId: decode.id,
  });

  const handleChange = async (e) => {
    setGuest((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(API + "/guestbook", {
        name: guest.name,
        whatsapp: "62" + guest.whatsapp,
        userId: guest.userId,
      });

      if (response.data.success) {
        mutate("/v1/get/guestbook");
        setShowAlert("Saved");
        setGuest({
          name: "",
          whatsapp: "",
          userId: decode.id,
        });
        const timer = setTimeout(() => {
          setShowAlert("");
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id, name) => {
    if (confirm(`Delete ${name}?`) == true) {
      deleteGuest(id);
    }
  };

  const deleteGuest = async (id) => {
    try {
      const response = await api.delete(API + "/guestbook/" + id);
      if (response.data.success) {
        mutate("/v1/get/guestbook");
        setShowAlert("Deleted Successfully");
        const timer = setTimeout(() => {
          setShowAlert("");
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.log(err);
    }
  };

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopy(true);
      const timer = setTimeout(() => {
        setCopy(false);
      }, 3000);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  const handleChangeMessage = (e) => {
    const value = e.target.value;
    setMessage(value);
    const linkSend = `https://wa.me/${undangan.phone}?text=${encodeURIComponent(
      value
    )}`;
    setLinkWA(linkSend);
  };
  const handleKirim = (name, phone) => {
    const link = `${window.location.origin}/?to=${encodeURIComponent(name)}`;
    setUndangan((prev) => ({
      ...prev,
      to: name,
      phone: phone,
      link: link,
    }));
    const msg = `Assalamu'alaikum Wr. Wb

Yth. ${name}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami :

${undangan.mempelai}

Berikut link undangan kami untuk info lengkap dari acara bisa kunjungi :
 
${link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Mohon maaf perihal undangan hanya di bagikan melalui  pesan ini. Terima kasih banyak atas perhatiannya.

Wassalamu'alaikum Wr. Wb.
Terima Kasih.`;
    setMessage(msg);
    const linkSend = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    setLinkWA(linkSend);
  };

  const fetcher = async () => {
    try {
      const response = await api.get(API + "/guestbook");

      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, error, isLoading } = useSWR("/v1/get/guestbook", fetcher);

  if (error) return <FailedToLoad />;
  if (isLoading) return <LoadingSekeleton />;
  return (
    <div className="col-span-3 px-4 pt-2">
      <div className="w-full rounded-xl bg-white text-gray-900 py-2 px-3 mb-6">
        Guest Book
      </div>
      <form action="" autoComplete="off" onSubmit={handleSubmit}>
        <div className="md:flex gap-2 mb-2">
          <label className="input input-bordered flex items-center gap-2 mb-2">
            <UserIcon className="h-3 w-3 mb-1" />
            <input
              type="text"
              name="name"
              value={guest.name}
              onChange={(e) => handleChange(e)}
              placeholder="Name"
              required
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 mb-2">
            +62
            <input
              type="tel"
              name="whatsapp"
              value={guest.whatsapp}
              onChange={(e) => {
                let onlyNumbers = e.target.value.replace(/[^\d]/g, "");
                setGuest((prevState) => ({
                  ...prevState,
                  whatsapp: onlyNumbers,
                }));
              }}
              placeholder="Whatsapp"
              required
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary mb-2 w-full md:w-fit"
          >
            Save
          </button>
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="table text-white">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th className="hidden md:block">Whatsapp</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ id, name, whatsapp }, key) => (
              <tr key={key}>
                <td>
                  {name} <br />
                  <span className="badge badge-ghost badge-sm md:hidden">
                    {whatsapp}
                  </span>
                </td>
                <td className="hidden md:block">{whatsapp}</td>
                <td>
                  <button
                    onClick={() => {
                      document.getElementById("modal_send").showModal();
                      handleKirim(name, whatsapp);
                    }}
                    className="btn btn-xs text-white bg-green-500 hover:bg-green-700 mr-2"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => handleDelete(id, name)}
                    className="btn btn-xs text-white bg-red-500 hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Send */}
      <dialog id="modal_send" className="modal" autoFocus="off">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Send Invitation!</h3>
          <table>
            <tbody className="text-left">
              <tr>
                <td>Send To</td>
                <td className="px-4">:</td>
                <td>{undangan.to}</td>
              </tr>
              <tr>
                <td>Whatsapp</td>
                <td className="px-4">:</td>
                <td>
                  <button>{undangan.phone}</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-default btn-sm mb-1" onClick={copyContent}>
            {copy ? "Copy to Clipboard" : "Copy Text"}
          </button>
          <textarea
            className="textarea textarea-bordered w-full disabled:text-white disabled:cursor-text"
            rows={12}
            name=""
            value={message}
            onChange={(e) => handleChangeMessage(e)}
          ></textarea>
          <div className="modal-action flex justify-between">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
            <a
              href={linkWA}
              target="_blank"
              className="btn bg-green-500 hover:bg-green-700 text-white"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              Send
            </a>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Guestbook;

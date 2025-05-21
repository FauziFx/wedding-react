import React, { useState } from "react";
import {
  ArrowUpRightIcon,
  ClipboardDocumentIcon,
  PaperAirplaneIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import api from "../utils/api";
import LoadingSekeleton from "./LoadingSekeleton";
import FailedToLoad from "./FailedToLoad";
import useSWR, { useSWRConfig } from "swr";

function Guestbook({ setShowAlert, dataUser }) {
  const API = import.meta.env.VITE_API_URL;
  const { mutate } = useSWRConfig();
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
    userId: dataUser.id,
  });
  const [person, setPerson] = useState([]);

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
          userId: dataUser.id,
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
    const customUrl = localStorage.getItem("customUrl") || "";
    const link = `${
      window.location.origin
    }/${customUrl}?to=${encodeURIComponent(name)}`;
    setUndangan((prev) => ({
      ...prev,
      to: name,
      phone: phone,
      link: link,
    }));
    const msg = `Assalamu'alaikum Wr. Wb

Yth. ${name}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami :

${person[0]?.name} & ${person[1]?.name}

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
      const response = await api.get("/guestbook/" + dataUser.id);
      const responsePeople = await api.get("/person/" + dataUser.id);
      setPerson(responsePeople.data.data);
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
      <div className="flex justify-between items-center w-full rounded-xl bg-white text-gray-900 py-2 px-3 mb-6">
        <p>Guest Book</p>
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
              <button className="btn btn-sm md:btn-md">Close</button>
            </form>
            <div className="flex items-center gap-1">
              <button
                className="btn btn-default btn-sm md:btn-md"
                onClick={copyContent}
              >
                <ClipboardDocumentIcon className="h-5 w-5" />{" "}
                {copy ? "Copy to Clipboard" : "Copy Text"}
              </button>
              <a
                href={linkWA}
                target="_blank"
                className="btn btn-sm md:btn-md bg-green-500 hover:bg-green-700 text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mb-1"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#fff"
                    d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
                  ></path>
                  <path
                    fill="#fff"
                    d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"
                  ></path>
                  <path
                    fill="#cfd8dc"
                    d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"
                  ></path>
                  <path
                    fill="#40c351"
                    d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
                  ></path>
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Send
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Guestbook;

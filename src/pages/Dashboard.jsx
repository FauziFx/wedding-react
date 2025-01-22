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
  NumberedListIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  UserIcon,
  TrashIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";

function Dashboard() {
  const [linkWA, setLinkWA] = useState("");
  const [message, setMessage] = useState("");
  const [onEdit, setOnEdit] = useState(true);
  const [menu, setMenu] = useState("home");
  const [copy, setCopy] = useState(false);
  const [file, setFile] = useState({
    foto_pengantin: "images/bg.png",
    background: "images/1.jpg",
    pengantin_1: "images/cowo.png",
    pengantin_2: "images/cewe.png",
  });
  const handleChangeFoto = (e) => {
    setFile((prev) => ({
      ...prev,
      [e.target.name]: URL.createObjectURL(e.target.files[0]),
    }));
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
  const [undangan, setUndangan] = useState({
    to: "",
    link: "",
    phone: "",
    mempelai: "John Doe & Jane Doe",
  });
  const handleChangeMessage = (e) => {
    const value = e.target.value;
    setMessage(value);
    const linkSend = `https://wa.me/${undangan.phone}?text=${encodeURIComponent(
      value
    )}`;
    setLinkWA(linkSend);
  };
  const handleKirim = (name, phone) => {
    const link = "https://ulems.my.id/?to=" + encodeURIComponent(name);
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
  const handleMenu = (menu) => {
    setMenu(menu);
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
        <div className="flex-none">Admin</div>
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
              <a className="hover:bg-red-500 hover:text-white">
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
          <div className="col-span-3 px-4 pt-2">
            <div className="w-full rounded-xl bg-white text-gray-900 py-2 px-3 mb-6">
              Guest Book
            </div>
            <div className="md:flex gap-2 mb-2">
              <label className="input input-bordered flex items-center gap-2 mb-2">
                <UserIcon className="h-3 w-3 mb-1" />
                <input type="text" placeholder="Name" />
              </label>
              <label className="input input-bordered flex items-center gap-2 mb-2">
                +62
                <input type="tel " placeholder="Whatsapp" />
              </label>
              <button className="btn btn-primary mb-2 w-full md:w-fit">
                Save
              </button>
            </div>
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
                  {/* row 1 */}
                  <tr>
                    <td>
                      Zemlak <br />
                      <span className="badge badge-ghost badge-sm md:hidden">
                        085724219411
                      </span>
                    </td>
                    <td className="hidden md:block">085724219411</td>
                    <td>
                      <button
                        onClick={() => {
                          document.getElementById("modal_send").showModal();
                          handleKirim("Ahmad Fauzi", "6285724219411");
                        }}
                        className="btn btn-xs text-white bg-green-500 hover:bg-green-700 mr-2"
                      >
                        Send
                      </button>
                      <button className="btn btn-xs text-white bg-red-500 hover:bg-red-700">
                        Delete
                      </button>
                    </td>
                  </tr>
                  {/* row 2 */}
                  <tr>
                    <td>
                      Daniel <br />
                      <span className="badge badge-ghost badge-sm md:hidden">
                        085724219411
                      </span>
                    </td>
                    <td className="hidden md:block">085724219411</td>
                    <td>
                      <button className="btn btn-xs text-white bg-green-500 hover:bg-green-700 mr-2">
                        Send
                      </button>
                      <button className="btn btn-xs text-white bg-red-500 hover:bg-red-700">
                        Delete
                      </button>
                    </td>
                  </tr>
                  {/* row 3 */}
                  <tr>
                    <td>
                      Leannon <br />
                      <span className="badge badge-ghost badge-sm md:hidden">
                        085724219411
                      </span>
                    </td>
                    <td className="hidden md:block">085724219411</td>
                    <td>
                      <button className="btn btn-xs text-white bg-green-500 hover:bg-green-700 mr-2">
                        Send
                      </button>
                      <button className="btn btn-xs text-white bg-red-500 hover:bg-red-700">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {menu == "setting" && (
          <div className="col-span-3 px-4 pt-2 pb-20">
            <div className="flex justify-between items-center w-full rounded-xl bg-white text-gray-900 py-1 px-3 mb-6">
              <p>Setting</p>
              <a
                href="http://localhost:5173/"
                target="_blank"
                className="btn btn-info btn-sm text-[#1d232a] rounded-badge"
              >
                Visit Web <ArrowUpRightIcon className="h-4 w-4 mb-1 inline" />
              </a>
            </div>
            <div className="w-full rounded-xl shadow-xl py-2 px-3 mb-6">
              <h2 className="text-xl">Foto Pengantin</h2>
              <div className="flex flex-col gap-2 justify-center my-2">
                {file.foto_pengantin != "" && (
                  <div className="avatar mx-auto py-4 md:py-0">
                    <div className="w-32 rounded-full border-4 border-white shadow-xl">
                      <img src={file.foto_pengantin} alt="Foto Pengantin" />
                    </div>
                  </div>
                )}
                <div className="flex gap-1 justify-center">
                  <input
                    type="file"
                    name="foto_pengantin"
                    onChange={handleChangeFoto}
                    className="file-input file-input-bordered file-input-sm md:file-input-md w-full md:w-fit mb-2"
                  />
                  <button className="btn btn-primary btn-sm md:btn-md">
                    Upload
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full rounded-xl shadow-xl py-2 px-3 mb-6">
              <h2 className="text-xl">Background</h2>
              <div className="flex flex-col gap-2 justify-center my-2">
                {file.background != "" && (
                  <div className="mx-auto py-4 md:py-0">
                    <div className="w-48 shadow-xl">
                      <img
                        src={file.background}
                        alt="Background"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                )}
                <div className="flex gap-1 justify-center">
                  <input
                    type="file"
                    name="background"
                    onChange={handleChangeFoto}
                    className="file-input file-input-bordered file-input-sm md:file-input-md w-full md:w-fit mb-2"
                  />
                  <button className="btn btn-primary btn-sm md:btn-md">
                    Upload
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full rounded-xl shadow-xl py-2 px-3 mb-6">
              <h2 className="text-xl">Pengantin 1</h2>
              <div className="flex flex-col gap-2 justify-center my-2">
                {file.pengantin_1 != "" && (
                  <div className="avatar mx-auto py-4 md:py-0">
                    <div className="w-32 rounded-full border-4 border-white shadow-xl">
                      <img src={file.pengantin_1} alt="Pengantin 1" />
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <input
                    type="file"
                    name="pengantin_1"
                    onChange={handleChangeFoto}
                    className="file-input file-input-bordered file-input-sm md:file-input-md w-full md:w-fit"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="" className="form-control w-full">
                  <div className="label pb-0">
                    <span className="label-text">Nama</span>
                  </div>
                  <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    <input type="text" className="grow" placeholder="Nama" />
                  </label>
                </label>
                <label htmlFor="" className="form-control w-full">
                  <div className="label pb-0">
                    <span className="label-text">Anak keberapa?</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    <input
                      className="input input-sm md:input-md input-bordered grow mb-2 md:mb-0"
                      placeholder="Anak keberapa?"
                    />
                    <div className="flex flex-row items-center">
                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <input
                            type="radio"
                            name="radio-10"
                            className="radio radio-sm md:radio-md checked:bg-pink-500"
                            defaultChecked
                          />
                          <span className="label-text ml-1">Perempuan</span>
                        </label>
                      </div>
                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <input
                            type="radio"
                            name="radio-10"
                            className="radio radio-sm md:radio-md checked:bg-blue-500"
                            defaultChecked
                          />
                          <span className="label-text ml-1">Laki-Laki</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </label>
                <label htmlFor="" className="form-control w-full mb-2">
                  <div className="label pb-0">
                    <span className="label-text">Nama Orang Tua</span>
                  </div>
                  <label className="input input-sm md:input-md input-bordered flex items-center gap-2 mb-1">
                    <span>Bapak</span>
                    <input
                      type="text"
                      className="grow"
                      placeholder="Nama Bapak"
                    />
                  </label>
                  <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
                    <span>Ibu</span>
                    <input
                      type="text"
                      className="grow"
                      placeholder="Nama Ibu"
                    />
                  </label>
                </label>
                <div className="text-right mb-2">
                  <button className="btn btn-primary btn-sm md:btn-md">
                    Save
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full rounded-xl shadow-xl py-2 px-3 mb-6">
              <h2 className="text-xl">Pengantin 2</h2>
              <div className="flex flex-col gap-2 justify-center my-2">
                {file.pengantin_2 != "" && (
                  <div className="avatar mx-auto py-4 md:py-0">
                    <div className="w-32 rounded-full border-4 border-white shadow-xl">
                      <img src={file.pengantin_2} alt="Pengantin 2" />
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <input
                    type="file"
                    name="pengantin_2"
                    onChange={handleChangeFoto}
                    className="file-input file-input-bordered file-input-sm md:file-input-md w-full md:w-fit"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="" className="form-control w-full">
                  <div className="label pb-0">
                    <span className="label-text">Nama</span>
                  </div>
                  <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    <input type="text" className="grow" placeholder="Nama" />
                  </label>
                </label>
                <label htmlFor="" className="form-control w-full">
                  <div className="label pb-0">
                    <span className="label-text">Anak keberapa?</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    <input
                      className="input input-sm md:input-md input-bordered grow mb-2 md:mb-0"
                      placeholder="Anak keberapa?"
                    />
                    <div className="flex flex-row items-center">
                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <input
                            type="radio"
                            name="radio-1"
                            className="radio radio-sm md:radio-md checked:bg-pink-500"
                            defaultChecked
                          />
                          <span className="label-text ml-1">Perempuan</span>
                        </label>
                      </div>
                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <input
                            type="radio"
                            name="radio-1"
                            className="radio radio-sm md:radio-md checked:bg-blue-500"
                            defaultChecked
                          />
                          <span className="label-text ml-1">Laki-Laki</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </label>
                <label htmlFor="" className="form-control w-full mb-2">
                  <div className="label pb-0">
                    <span className="label-text">Nama Orang Tua</span>
                  </div>
                  <label className="input input-sm md:input-md input-bordered flex items-center gap-2 mb-1">
                    <span>Bapak</span>
                    <input
                      type="text"
                      className="grow"
                      placeholder="Nama Bapak"
                    />
                  </label>
                  <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
                    <span>Ibu</span>
                    <input
                      type="text"
                      className="grow"
                      placeholder="Nama Ibu"
                    />
                  </label>
                </label>
                <div className="text-right mb-2">
                  <button className="btn btn-primary btn-sm md:btn-md">
                    Save
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full rounded-xl shadow-xl py-2 px-3 mb-6">
              <h2 className="text-xl">Tanggal & Tempat</h2>
              <label htmlFor="" className="form-control w-full">
                <div className="label pb-0">
                  <span className="label-text">Jam Berapa?</span>
                </div>
                <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
                  <input type="time" className="grow" placeholder="Jam" />
                </label>
              </label>
              <label htmlFor="" className="form-control w-full">
                <div className="label pb-0">
                  <span className="label-text">Tanggal Berapa?</span>
                </div>
                <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
                  <input type="date" className="grow" placeholder="Tanggal" />
                </label>
              </label>
              <label className="form-control">
                <div className="label pb-0">
                  <span className="label-text">Bertempat Di Mana?</span>
                </div>
                <textarea
                  className="textarea textarea-bordered textarea-sm md:textarea-md"
                  placeholder="Alamat"
                ></textarea>
              </label>
              <label htmlFor="" className="form-control w-full">
                <div className="label pb-0">
                  <span className="label-text">Link Google Maps</span>
                </div>
                <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  <input type="url" className="grow" placeholder="https://" />
                </label>
              </label>
              <div className="text-right my-2">
                <button className="btn btn-primary btn-sm md:btn-md">
                  Save
                </button>
              </div>
            </div>
            <div className="w-full rounded-xl shadow-xl py-2 px-3 mb-6">
              <h2 className="text-xl">Galeri Foto</h2>
              <div className="flex flex-col gap-2 justify-center my-2">
                <div className="text-center">
                  <label htmlFor="" className="form-control w-full">
                    <div className="flex gap-1">
                      <input
                        type="file"
                        name="foto_pengantin"
                        className="file-input file-input-bordered file-input-sm md:file-input-md w-full md:w-fit mb-0"
                        multiple
                      />
                      <button className="btn btn-primary btn-sm md:btn-md">
                        Upload
                      </button>
                    </div>
                    <div className="label pt-1">
                      <div className="label-text-alt">
                        Maksimal 5 Foto aja ya
                      </div>
                    </div>
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <img src="images/1.jpg" alt="" className="rounded-lg" />
                    <button className="btn btn-error btn-xs text-gray-200 w-full rounded-full my-1">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <img src="images/1.jpg" alt="" className="rounded-lg" />
                    <button className="btn btn-error btn-xs text-gray-200 w-full rounded-full my-1">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <img src="images/1.jpg" alt="" className="rounded-lg" />
                    <button className="btn btn-error btn-xs text-gray-200 w-full rounded-full my-1">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <img src="images/1.jpg" alt="" className="rounded-lg" />
                    <button className="btn btn-error btn-xs text-gray-200 w-full rounded-full my-1">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <img src="images/1.jpg" alt="" className="rounded-lg" />
                    <button className="btn btn-error btn-xs text-gray-200 w-full rounded-full my-1">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full rounded-xl shadow-xl py-2 px-3 mb-6">
              <h2 className="text-xl">Rekening</h2>
              <div className="my-2 text-center">
                <label className="input input-bordered input-sm md:input-md flex items-center gap-2 mb-2">
                  <UserIcon className="h-4 w-4" />
                  <input
                    type="text"
                    className="grow"
                    placeholder="Nama Rekening"
                  />
                </label>
                <label className="input input-bordered input-sm md:input-md flex items-center gap-2 mb-2">
                  <BuildingLibraryIcon className="h-4 w-4" />
                  <input type="text" className="grow" placeholder="Nama Bank" />
                </label>
                <label className="input input-bordered input-sm md:input-md flex items-center gap-2 mb-2">
                  <CreditCardIcon className="h-4 w-4" />
                  <input
                    type="text"
                    className="grow"
                    placeholder="Nomor Rekening"
                  />
                </label>
                <div className="text-right">
                  <button className="btn btn-primary btn-sm md:btn-md">
                    Save
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="table text-white">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th className="hidden md:block">Account</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    <tr>
                      <td>
                        Zemlak <br />
                        <span className="badge badge-ghost badge-sm md:hidden">
                          BCA : 085724219411
                        </span>
                      </td>
                      <td className="hidden md:block">BCA : 085724219411</td>
                      <td>
                        <button className="btn btn-xs text-white bg-red-500 hover:bg-red-700">
                          Delete
                        </button>
                      </td>
                    </tr>
                    {/* row 2 */}
                    <tr>
                      <td>
                        Daniel <br />
                        <span className="badge badge-ghost badge-sm md:hidden">
                          BRI : 085724219411
                        </span>
                      </td>
                      <td className="hidden md:block">BRI : 085724219411</td>
                      <td>
                        <button className="btn btn-xs text-white bg-red-500 hover:bg-red-700">
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="w-full rounded-xl shadow-xl py-2 px-3 mb-6">
              <h2 className="text-xl">Musik</h2>
              <div className="flex flex-col gap-2 justify-center my-2">
                <div className="mx-auto">
                  <audio controls>
                    <source src="music/sound.mp3" type="audio/mpeg" />
                  </audio>
                </div>
                <div className="flex gap-1 justify-center">
                  <input
                    type="file"
                    name="background"
                    onChange={handleChangeFoto}
                    className="file-input file-input-bordered file-input-sm md:file-input-md w-full md:w-fit mb-2"
                  />
                  <button className="btn btn-primary btn-sm md:btn-md">
                    Upload
                  </button>
                </div>
              </div>
            </div>
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

      {/* Modal Send */}
      <dialog id="modal_send" className="modal" autoFocus="off">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Send Invitation!</h3>
          <table>
            <tbody className="text-left">
              <tr>
                <td>Send To</td>
                <td className="px-4">:</td>
                <td>John</td>
              </tr>
              <tr>
                <td>Whatsapp</td>
                <td className="px-4">:</td>
                <td>
                  <button>081234567</button>
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

export default Dashboard;

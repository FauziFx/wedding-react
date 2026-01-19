import { MapIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import useSWR, { useSWRConfig } from "swr";
import FailedToLoad from "./FailedToLoad";
import LoadingSekeleton from "./LoadingSekeleton";
import useSWRImmutable from "swr/immutable";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import "dayjs/locale/id";
dayjs.locale("id");

function General({ setShowAlert, dataUser, menu }) {
  const API = import.meta.env.VITE_API_URL;
  const { mutate } = useSWRConfig();
  const [isSameDate, setIsSameDate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [general, setGeneral] = useState({
    id: "",
    date_name_1: "",
    date_1: "",
    time_1: "",
    date_name_2: "",
    date_2: "",
    time_2: "",
    address_1: "",
    maps_1: "",
    address_2: "",
    maps_2: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setGeneral((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.patch(API + "/general/" + general.id, {
        date_name_1: general.date_name_1,
        date_1: general.date_1,
        time_1: general.time_1,
        date_name_2: general.date_name_2,
        date_2: general.date_2,
        time_2: general.time_2,
        address_1: general.address_1,
        maps_1: general.maps_1,
        address_2: general.address_2,
        maps_2: general.maps_2,
      });
      if (response.data.success) {
        setLoading(false);
        mutate("/v1/get/general");
        setShowAlert("Saved");
        const timer = setTimeout(() => {
          setShowAlert("");
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const fetcher = async () => {
    try {
      const response = await api.get(API + "/general/" + dataUser.id);
      const data = response.data.data;
      setGeneral((prevState) => ({
        ...prevState,
        id: data.id,
        date_name_1: data.date_name_1 || "",
        date_1: data.date_1 || "",
        time_1: data.time_1 || "",
        date_name_2: data.date_name_2 || "",
        date_2: data.date_2 || "",
        time_2: data.time_2 || "",
        address_1: data.address_1 || "",
        maps_1: data.maps_1 || "",
        address_2: data.address_2 || "",
        maps_2: data.maps_2 || "",
      }));
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (menu == "setting") {
      mutate("/v1/get/general");
    }
  }, [menu]);

  const { data, error, isLoading } = useSWRImmutable(
    "/v1/get/general",
    fetcher
  );

  if (error) return <FailedToLoad />;
  if (isLoading) return <LoadingSekeleton />;
  return (
    <div className="w-full rounded-xl shadow-xl mb-6">
      <h1 className="text-2xl text-center w-full py-2 bg-gray-700">General</h1>
      <form action="" onSubmit={handleSubmit}>
        <div
          className={
            "py-2 px-3 " +
            (loading ? "opacity-50 cursor-not-allowed pointer-events-none" : "")
          }
        >
          <h2 className="font-semibold text-xl">Tanggal 1</h2>

          <label htmlFor="" className="form-control w-full">
            <div className="label pb-0 pt-1">
              <span className="label-text">Nama Acara</span>
            </div>
            <select
              className="select select-bordered select-sm md:select-md w-full"
              name="date_name_1"
              value={general.date_name_1}
              onChange={(e) => {
                if (e.target.value == "") {
                  setGeneral({
                    ...general,
                    date_name_1: "",
                    date_1: "",
                    time_1: "",
                    address_1: "",
                    maps_1: "",
                  });
                }
                handleChange(e);
              }}
            >
              <option value="">Tidak Ada</option>
              <option value="akad">Akad</option>
              <option value="resepsi">Resepsi</option>
              <option value="akad&resepsi">Akad & Resepsi</option>
            </select>
          </label>

          <label htmlFor="" className="form-control w-full">
            <div className="label pb-0">
              <span className="label-text">Jam</span>
            </div>
            <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
              <input
                type="time"
                name="time_1"
                value={general.time_1}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="Jam"
              />
            </label>
          </label>
          <label htmlFor="" className="form-control w-full">
            <div className="label pb-0">
              <span className="label-text">Tanggal</span>
            </div>
            <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
              <input
                type="date"
                name="date_1"
                value={general.date_1}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="Tanggal"
              />
            </label>
          </label>
          <label className="form-control">
            <div className="label pb-0">
              <span className="label-text">Bertempat Di Mana?</span>
            </div>
            <textarea
              className="textarea textarea-bordered textarea-sm md:textarea-md"
              name="address_1"
              value={general.address_1}
              onChange={(e) => handleChange(e)}
              placeholder="Alamat"
              required
            ></textarea>
          </label>
          <label htmlFor="" className="form-control w-full">
            <div className="label pb-0">
              <span className="label-text">Link Google Maps</span>
            </div>
            <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
              <MapIcon className="h-4 w-4" />
              <input
                type="url"
                name="maps_1"
                value={general.maps_1}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="https://"
                required
              />
            </label>
          </label>

          <h2 className="font-semibold text-xl mt-6">Tanggal 2</h2>

          <label htmlFor="" className="form-control w-full">
            <div className="label pb-0 pt-1">
              <span className="label-text">Nama Acara</span>
            </div>
            <select
              className="select select-bordered select-sm md:select-md w-full"
              name="date_name_2"
              value={general.date_name_2}
              onChange={(e) => {
                if (e.target.value == "") {
                  setGeneral({
                    ...general,
                    date_name_2: "",
                    date_2: "",
                    time_2: "",
                    address_2: "",
                    maps_2: "",
                  });
                }
                handleChange(e);
              }}
            >
              <option value="">Tidak Ada</option>
              <option value="akad">Akad</option>
              <option value="resepsi">Resepsi</option>
              <option value="akad&resepsi">Akad & Resepsi</option>
            </select>
          </label>

          <label htmlFor="" className="form-control w-full">
            <div className="label pb-0">
              <span className="label-text">Jam</span>
            </div>
            <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
              <input
                type="time"
                name="time_2"
                value={general.time_2}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="Jam"
              />
            </label>
          </label>
          <label htmlFor="" className="form-control w-full">
            <div className="label pb-0">
              <span className="label-text">Tanggal</span>
            </div>
            <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
              <input
                type="date"
                name="date_2"
                value={general.date_2}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="Tanggal"
              />
            </label>
          </label>
          <label className="form-control">
            <div className="label pb-0">
              <span className="label-text">Bertempat Di Mana?</span>
            </div>
            <textarea
              className="textarea textarea-bordered textarea-sm md:textarea-md"
              name="address_2"
              value={general.address_2}
              onChange={(e) => handleChange(e)}
              placeholder="Alamat"
              required
            ></textarea>
          </label>
          <label htmlFor="" className="form-control w-full">
            <div className="label pb-0">
              <span className="label-text">Link Google Maps</span>
            </div>
            <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
              <MapIcon className="h-4 w-4" />
              <input
                type="url"
                name="maps_2"
                value={general.maps_2}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="https://"
                required
              />
            </label>
          </label>
          <div className="text-center mt-4">
            {general.date_name_1 && (
              <>
                <p className="font-esthetic text-2xl capitalize">
                  {general.date_name_1.replace("&", " & ")}
                </p>
                {general.date_1 && (
                  <p className="text-sm">
                    {dayjs(general.date_1).tz("Asia/Jakarta").format("dddd")}
                    <br />
                    {dayjs(general.date_1)
                      .tz("Asia/Jakarta")
                      .format("DD MMMM YYYY")}
                  </p>
                )}
                {general.time_1 && (
                  <p className="text-sm">
                    Pukul <br />
                    {general.time_1.substring(0, 5)} WIB - Selesai
                  </p>
                )}
                {general.address_1 && (
                  <p className="text-sm">
                    Bertempat di <br />
                    {general.address_1}
                  </p>
                )}
              </>
            )}

            {general.date_name_2 && (
              <>
                <p className="font-esthetic text-2xl capitalize mt-2">
                  {general.date_name_2.replace("&", " & ")}
                </p>
                {general.date_2 && (
                  <p className="text-sm">
                    {dayjs(general.date_2).tz("Asia/Jakarta").format("dddd")}
                    <br />
                    {dayjs(general.date_2)
                      .tz("Asia/Jakarta")
                      .format("DD MMMM YYYY")}
                  </p>
                )}
                {general.time_2 && (
                  <p className="text-sm">
                    Pukul <br />
                    {general.time_2.substring(0, 5)} WIB - Selesai
                  </p>
                )}
                {general.address_2 && (
                  <p className="text-sm">
                    Bertempat di <br />
                    {general.address_2}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="text-right my-2">
            <button
              type="submit"
              className="btn btn-primary btn-sm md:btn-md"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default General;

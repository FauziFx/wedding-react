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

function General({ setShowAlert, dataUser, menu }) {
  const API = import.meta.env.VITE_API_URL;
  const { mutate } = useSWRConfig();
  const [isSameDate, setIsSameDate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [general, setGeneral] = useState({
    id: "",
    ceremony_time: "",
    ceremony_date: "",
    reception_time: "",
    reception_date: "",
    address: "",
    maps: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (isSameDate) {
      if (name.includes("time")) {
        setGeneral((prevState) => ({
          ...prevState,
          ceremony_time: value,
          reception_time: value,
        }));
      } else if (name.includes("date")) {
        setGeneral((prevState) => ({
          ...prevState,
          ceremony_date: value,
          reception_date: value,
        }));
      } else {
        setGeneral((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      setGeneral((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.patch(API + "/general/" + general.id, {
        ceremony_time: general.ceremony_time,
        ceremony_date: general.ceremony_date,
        reception_time: general.reception_time,
        reception_date: general.reception_date,
        address: general.address,
        maps: general.maps,
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
      console.log(error);
    }
  };

  const fetcher = async () => {
    try {
      const response = await api.get(API + "/general/" + dataUser.id);
      const data = response.data.data;
      const dateCeremony = data.date
        ? dayjs(data.ceremony_date).tz("Asia/Jakarta").format("YYYY-MM-DD")
        : "";
      const dateReception = data.date
        ? dayjs(data.reception_date).tz("Asia/Jakarta").format("YYYY-MM-DD")
        : "";
      setGeneral((prevState) => ({
        ...prevState,
        id: data.id,
        ceremony_time: data.ceremony_time || "",
        ceremony_date: dateCeremony,
        reception_time: data.reception_time || "",
        reception_date: dateReception,
        address: data.address || "",
        maps: data.maps || "",
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
          <label htmlFor="" className="form-control w-full p-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={isSameDate}
                onChange={() => {
                  if (isSameDate) {
                    setIsSameDate(!isSameDate);
                  } else {
                    setIsSameDate(!isSameDate);
                    setGeneral((prevState) => ({
                      ...prevState,
                      reception_time: general.ceremony_time,
                      reception_date: general.ceremony_date,
                    }));
                  }
                }}
              />
              <span className="cursor-pointer">
                Tanggal Akad dan Respsi sama
              </span>
            </label>
          </label>

          {/* Ceremony Date */}
          <label htmlFor="" className="form-control w-full">
            <div className="label pb-0">
              <span className="label-text">Jam Akad</span>
            </div>
            <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
              <input
                type="time"
                name="ceremony_time"
                value={general.ceremony_time}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="Jam"
                required
              />
            </label>
          </label>
          <label htmlFor="" className="form-control w-full">
            <div className="label pb-0">
              <span className="label-text">Tanggal Akad</span>
            </div>
            <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
              <input
                type="date"
                name="ceremony_date"
                value={general.ceremony_date}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="Tanggal"
                required
              />
            </label>
          </label>

          {/* Reception Date */}
          <label htmlFor="" className="form-control w-full">
            <div className="label pb-0">
              <span className="label-text">Jam Resepsi</span>
            </div>
            <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
              <input
                type="time"
                name="reception_time"
                value={general.reception_time}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="Jam"
                required
              />
            </label>
          </label>
          <label htmlFor="" className="form-control w-full">
            <div className="label pb-0">
              <span className="label-text">Tanggal Respsi</span>
            </div>
            <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
              <input
                type="date"
                name="reception_date"
                value={general.reception_date}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="Tanggal"
                required
              />
            </label>
          </label>

          <label className="form-control">
            <div className="label pb-0">
              <span className="label-text">Bertempat Di Mana?</span>
            </div>
            <textarea
              className="textarea textarea-bordered textarea-sm md:textarea-md"
              name="address"
              value={general.address}
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
                name="maps"
                value={general.maps}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="https://"
                required
              />
            </label>
          </label>
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

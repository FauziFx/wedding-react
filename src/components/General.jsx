import { MapIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
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

function General({ setShowAlert, dataUser }) {
  const API = import.meta.env.VITE_API_URL;
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);
  const [general, setGeneral] = useState({
    id: "",
    time: "",
    date: "",
    address: "",
    maps: "",
  });

  const handleChange = (e) => {
    setGeneral((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.patch(API + "/general/" + general.id, {
        time: general.time,
        date: general.date,
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

      setGeneral((prevState) => ({
        ...prevState,
        id: data.id,
        time: data.time || "",
        date: dayjs(data.date).tz("Asia/Jakarta").format("YYYY-MM-DD") || "",
        address: data.address || "",
        maps: data.maps || "",
      }));
      return data;
    } catch (error) {
      console.log(error);
    }
  };

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
          <label htmlFor="" className="form-control w-full">
            <div className="label pb-0">
              <span className="label-text">Jam Berapa?</span>
            </div>
            <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
              <input
                type="time"
                name="time"
                value={general.time}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="Jam"
                required
              />
            </label>
          </label>
          <label htmlFor="" className="form-control w-full">
            <div className="label pb-0">
              <span className="label-text">Tanggal Berapa?</span>
            </div>
            <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
              <input
                type="date"
                name="date"
                value={general.date}
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

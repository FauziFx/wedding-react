import {
  CalendarIcon,
  PencilSquareIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import api from "../utils/api";
import LoadingSekeleton from "./LoadingSekeleton";
import FailedToLoad from "./FailedToLoad";

function Story({ setShowAlert, dataUser, menu }) {
  const API = import.meta.env.VITE_API_URL;
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const [dataStory, setDataStory] = useState({
    id: "",
    year: "",
    title: "",
    text: "",
    userId: dataUser.id,
    urlId: dataUser.urlId,
  });
  const handleChange = async (e) => {
    setDataStory((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setDataStory({
      ...dataStory,
      id: item.id,
      year: item.year,
      title: item.title,
      text: item.text,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      let response;

      if (isEditMode) {
        response = await api.patch(API + "/story/" + dataStory.id, {
          year: dataStory.year,
          title: dataStory.title,
          text: dataStory.text,
        });
      } else {
        response = await api.post(API + "/story", {
          year: dataStory.year,
          title: dataStory.title,
          text: dataStory.text,
          userId: dataStory.userId,
          urlId: dataStory.urlId,
        });
      }
      if (response.data.success) {
        mutate("/v1/get/story");
        setShowAlert("Saved");
        setDataStory({
          id: "",
          year: "",
          title: "",
          text: "",
          userId: dataUser.id,
          urlId: dataUser.urlId,
        });
        setIsEditMode(false);
        setLoading(false);
        const timer = setTimeout(() => {
          setShowAlert("");
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    if (confirm(`Delete Story?`) == true) {
      deleteStory(id);
    }
  };

  const deleteStory = async (id) => {
    try {
      setLoading(true);
      const response = await api.delete(API + "/story/" + id);
      if (response.data.success) {
        mutate("/v1/get/story");
        setShowAlert("Deleted Successfully");
        setLoading(false);
        const timer = setTimeout(() => {
          setShowAlert("");
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.log(err);
    }
  };

  const fetcher = async () => {
    try {
      const response = await api.get(API + "/story/" + dataUser.id);

      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (menu == "setting") {
      mutate("/v1/get/story");
    }
  }, [menu]);

  const { data, error, isLoading } = useSWR("/v1/get/story", fetcher);

  if (error) return <FailedToLoad />;
  if (isLoading) return <LoadingSekeleton />;

  return (
    <div className="w-full rounded-xl shadow-xl mb-6">
      <h1 className="text-2xl text-center w-full py-2 bg-gray-700">
        Our Story
      </h1>
      <div
        className={
          "py-2 px-3 " +
          (loading ? "opacity-50 cursor-not-allowed pointer-events-none" : "")
        }
      >
        <form action="" autoComplete="off" onSubmit={handleSubmit}>
          <div className="my-2 text-center">
            <label className="input input-bordered input-sm md:input-md flex items-center gap-2 mb-2">
              <CalendarIcon className="h-4 w-4" />
              <input
                type="number"
                name="year"
                value={dataStory.year}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="Tahun E.g. 2021"
                required
                onFocus={(e) => {
                  e.target.addEventListener(
                    "wheel",
                    function (e) {
                      e.preventDefault();
                    },
                    {
                      passive: false,
                    }
                  );
                }}
              />
            </label>
            <label className="input input-bordered input-sm md:input-md flex items-center gap-2 mb-2">
              <PencilSquareIcon className="h-4 w-4" />
              <input
                type="text"
                name="title"
                value={dataStory.title}
                onChange={(e) => handleChange(e)}
                className="grow"
                placeholder="Judul"
                required
              />
            </label>
            <label className="flex items-center gap-2 mb-2">
              <textarea
                className="flex-1 textarea textarea-bordered leading-1"
                name="text"
                value={dataStory.text}
                onChange={(e) => handleChange(e)}
                placeholder="Cerita"
                rows={5}
                required
              ></textarea>
            </label>
            <div className="text-right">
              <button
                type="submit"
                className="btn btn-primary btn-sm md:btn-md"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : isEditMode ? (
                  "Save"
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </div>
        </form>
        <div>
          <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical text-sm mb-5">
            {data.map((item, index) => (
              <li key={index}>
                <div className="timeline-middle">
                  <ClockIcon className="h-5 w-5" />
                </div>
                <div
                  className={
                    index % 2 === 0
                      ? "timeline-start md:text-end"
                      : "timeline-end"
                  }
                >
                  <time className="font-mono italic">{item.year}</time>
                  <div className="text-lg font-black">{item.title}</div>
                  {item.text} <br />
                  <button
                    className="btn btn-xs btn-success mr-1"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
                <hr />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Story;

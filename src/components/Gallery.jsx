import { ExclamationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import { useSWRConfig } from "swr";
import useSWRImmutable from "swr/immutable";
import FailedToLoad from "./FailedToLoad";
import LoadingSekeleton from "./LoadingSekeleton";
import { v4 as uuidv4 } from "uuid";

function Gallery({ setShowAlert, dataUser, menu }) {
  const API = import.meta.env.VITE_API_URL;
  const inputFile = useRef(null);
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files.length != 0) {
      const max = 6 - images.length;
      if (e.target.files.length <= max) {
        const selectedFiles = Array.from(e.target.files);
        const renamedFiles = selectedFiles.map((file, index) => {
          const newName =
            uuidv4() + file.name.substring(file.name.lastIndexOf("."));
          return new File([file], newName, { type: file.type });
        });
        setFiles(renamedFiles);
      } else {
        alert(`Maksimal 6 Foto, ${max} foto lagi`);
        // Reset value
        inputFile.current.value = null;
      }
    }
  };

  const handleDelete = (id) => {
    if (confirm(`Delete Image?`) == true) {
      deleteImage(id);
    }
  };

  const deleteImage = async (id) => {
    try {
      setLoading(true);
      const response = await api.delete(API + "/gallery/" + id);
      if (response.data.success) {
        mutate("/v1/get/gallery");
        setShowAlert("Deleted Successfully");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    formData.append("userId", dataUser.id);

    try {
      const response = await api.post(API + "/gallery", formData);
      if (response.data.success) {
        mutate("/v1/get/gallery");
        setShowAlert("Saved");
        setLoading(false);
        inputFile.current.value = null;
        const timer = setTimeout(() => {
          setShowAlert("");
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetcher = async () => {
    try {
      const response = await api.get(API + "/gallery/" + dataUser.id);
      const data = response.data.data;

      if (data) {
        setImages(data);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (menu == "setting") {
      mutate("/v1/get/gallery");
    }
  }, [menu]);

  const { data, error, isLoading } = useSWRImmutable(
    "/v1/get/gallery",
    fetcher
  );

  if (error) return <FailedToLoad />;
  if (isLoading) return <LoadingSekeleton />;

  return (
    <div className="w-full rounded-xl shadow-xl mb-6">
      <h1 className="text-2xl text-center w-full py-2 bg-gray-700">Galeri</h1>
      <div
        className={
          "py-2 px-3 " +
          (loading ? "opacity-50 cursor-not-allowed pointer-events-none" : "")
        }
      >
        <form
          className="flex gap-1 justify-center my-2"
          onSubmit={handleSubmit}
        >
          <input
            type="file"
            name="background"
            onChange={(e) => handleFileChange(e)}
            accept="image/jpeg,image/png"
            multiple
            ref={inputFile}
            className="file-input file-input-bordered file-input-sm md:file-input-md w-full md:w-fit mb-2"
            required
            disabled={images.length === 6}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm md:btn-md"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Upload"
            )}
          </button>
        </form>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {images &&
            images.map(({ id, image }, key) => (
              <div key={key}>
                <img
                  src={API + "/images/" + image}
                  alt=""
                  className="rounded-lg"
                />
                <button
                  onClick={() => handleDelete(id)}
                  className="btn btn-error btn-xs text-gray-200 w-full rounded-full my-1 bg-red-500 hover:bg-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
        </div>
        <span className="text-xs text-white">
          <ExclamationCircleIcon className="h-4 w-4 mb-1 inline" /> Max 6 Photo
        </span>
      </div>
    </div>
  );
}

export default Gallery;

import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FailedToLoad from "./FailedToLoad";
import LoadingSekeleton from "./LoadingSekeleton";
import useSWRImmutable from "swr/immutable";
import api from "../utils/api";
import { useSWRConfig } from "swr";

function Foto({ setShowAlert, dataUser, menu }) {
  const API = import.meta.env.VITE_API_URL;
  const fileInputImage = useRef(null);
  const fileInputBgImage = useRef(null);
  const fileInputMusic = useRef(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingBgImage, setLoadingBgImage] = useState(false);
  const [loadingMusic, setLoadingMusic] = useState(false);
  const { mutate } = useSWRConfig();
  const [file, setFile] = useState({
    id: "",
    image: "",
    image_preview: "",
    bg_image: "",
    bg_image_preview: "",
    music: "",
    music_preview: "",
  });

  const handleChangeImage = async (e) => {
    if (e.target.files.length != 0) {
      const name = e.target.name;
      const name_preview = name + "_preview";
      const files = e.target.files[0];
      const maxSize = 5 * 1024 * 1024;
      if (files.size > maxSize) {
        alert("Maximum Size : 5MB");
        return false;
      } else {
        const ext = files.type == "image/jpeg" ? ".jpg" : ".png";
        const fileName = uuidv4() + ext;
        const myRenamedFile = new File([files], fileName, {
          type: files.type,
        });
        setFile((prevState) => ({
          ...prevState,
          [name]: myRenamedFile,
          [name_preview]: URL.createObjectURL(myRenamedFile),
        }));
      }
    }
  };

  const handleChangeMusic = async (e) => {
    if (e.target.files.length != 0) {
      const name = e.target.name;
      const name_preview = name + "_preview";
      const files = e.target.files[0];
      const maxSize = 10 * 1024 * 1024;
      if (files.size > maxSize) {
        alert("Maximum Size : 10MB");
        return false;
      } else {
        const ext = ".mp3";
        const fileName = uuidv4() + ext;
        const myRenamedFile = new File([files], fileName, {
          type: files.type,
        });
        setFile((prevState) => ({
          ...prevState,
          [name]: myRenamedFile,
          [name_preview]: URL.createObjectURL(myRenamedFile),
        }));
      }
    }
  };

  const handleSubmitImage = async (e) => {
    e.preventDefault();
    try {
      setLoadingImage(true);
      const fileName = file.image.name;
      const formData = new FormData();
      formData.append("image_file", file.image);
      formData.append("image", fileName);
      formData.append("id", file.id);

      const response = await api.post(API + "/general/image", formData);
      if (response.data.success) {
        setLoadingImage(false);
        mutate("/v1/get/general/image");
        setShowAlert("Saved");
        fileInputImage.current.value = null;
        const timer = setTimeout(() => {
          setShowAlert("");
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitBgImage = async (e) => {
    e.preventDefault();
    try {
      setLoadingBgImage(true);
      const fileName = file.bg_image.name;
      const formData = new FormData();
      formData.append("bg_image_file", file.bg_image);
      formData.append("bg_image", fileName);
      formData.append("id", file.id);

      const response = await api.post(API + "/general/bg_image", formData);
      if (response.data.success) {
        setLoadingBgImage(false);
        mutate("/v1/get/general/image");
        setShowAlert("Saved");
        fileInputBgImage.current.value = null;
        const timer = setTimeout(() => {
          setShowAlert("");
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitMusic = async (e) => {
    e.preventDefault();
    try {
      setLoadingMusic(true);
      const fileName = file.music.name;
      const formData = new FormData();
      formData.append("music_file", file.music);
      formData.append("music", fileName);
      formData.append("id", file.id);

      const response = await api.post(API + "/general/music", formData);
      if (response.data.success) {
        setLoadingMusic(false);
        mutate("/v1/get/general/image");
        setShowAlert("Saved");
        fileInputMusic.current.value = null;
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
      const urlImage = API + "/images/";
      const urlMusic = API + "/music/";
      const imagePreview = data.image != null ? urlImage + data.image : "";
      const bgImagePreview =
        data.bg_image != null ? urlImage + data.bg_image : "";
      const musicPreview = data.music != null ? urlMusic + data.music : "";
      setFile((prevState) => ({
        ...prevState,
        id: data.id,
        image_preview: imagePreview,
        bg_image_preview: bgImagePreview,
        music_preview: musicPreview,
      }));
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (menu == "setting") {
      mutate("/v1/get/general/image");
    }
  }, [menu]);

  const { data, error, isLoading } = useSWRImmutable(
    "/v1/get/general/image",
    fetcher
  );

  if (error) return <FailedToLoad />;
  if (isLoading) return <LoadingSekeleton />;

  return (
    <div className="w-full rounded-xl shadow-xl mb-6">
      <h1 className="text-2xl text-center w-full py-2 bg-gray-700">Foto</h1>
      <div className="py-2 px-3">
        <h2 className="text-xl text-center mt-4">Foto Pengantin</h2>
        <div className="flex flex-col gap-2 justify-center my-2">
          <div className="avatar mx-auto py-2 md:py-0">
            <div className="w-32 rounded-full border-4 border-white shadow-xl">
              {file.image_preview != "" && <img src={file.image_preview} />}
            </div>
          </div>
          <form
            className="flex gap-1 justify-center my-2"
            onSubmit={handleSubmitImage}
          >
            <input
              type="file"
              name="image"
              onChange={(e) => handleChangeImage(e)}
              accept="image/jpeg,image/png"
              ref={fileInputImage}
              className="file-input file-input-bordered file-input-sm md:file-input-md w-full md:w-fit mb-2"
              required
              disabled={loadingImage}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm md:btn-md"
              disabled={loadingImage}
            >
              {loadingImage ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Upload"
              )}
            </button>
          </form>
        </div>
        <h2 className="text-xl text-center mt-4">Background</h2>
        <div className="flex flex-col gap-2 justify-center my-2">
          <div className="mx-auto py-2 md:py-0">
            <div className="w-48 shadow-xl">
              {file.bg_image_preview != "" && (
                <img src={file.bg_image_preview} className="rounded-lg" />
              )}
            </div>
          </div>
          <form
            className="flex gap-1 justify-center my-2"
            onSubmit={handleSubmitBgImage}
          >
            <input
              type="file"
              name="bg_image"
              onChange={(e) => handleChangeImage(e)}
              accept="image/jpeg,image/png"
              ref={fileInputBgImage}
              className="file-input file-input-bordered file-input-sm md:file-input-md w-full md:w-fit mb-2"
              required
              disabled={loadingBgImage}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm md:btn-md"
              disabled={loadingBgImage}
            >
              {loadingBgImage ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Upload"
              )}
            </button>
          </form>
        </div>
        <h2 className="text-xl text-center mt-4">Musik</h2>
        <div className="flex flex-col gap-2 justify-center my-2">
          <div className="mx-auto">
            {file.music_preview != "" && (
              <audio controls>
                <source src={file.music_preview} type="audio/mpeg" />
              </audio>
            )}
          </div>
          <form
            className="flex gap-1 justify-center my-2"
            onSubmit={handleSubmitMusic}
          >
            <input
              type="file"
              name="music"
              onChange={(e) => handleChangeMusic(e)}
              accept="audio/mpeg"
              ref={fileInputMusic}
              className="file-input file-input-bordered file-input-sm md:file-input-md w-full md:w-fit mb-2"
              required
              disabled={loadingMusic}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm md:btn-md"
              disabled={loadingMusic}
            >
              {loadingMusic ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Upload"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Foto;

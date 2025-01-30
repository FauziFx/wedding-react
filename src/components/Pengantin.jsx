import { UserIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "../utils/api";
import { useSWRConfig } from "swr";
import useSWRImmutable from "swr/immutable";
import FailedToLoad from "./FailedToLoad";
import LoadingSekeleton from "./LoadingSekeleton";

function Pengantin({ setShowAlert, dataUser, menu }) {
  const API = import.meta.env.VITE_API_URL;
  const { mutate } = useSWRConfig();
  const fileInput1 = useRef(null);
  const fileInput2 = useRef(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [file, setFile] = useState({
    image1: "",
    image1_preview: "",
    image2: "",
    image2_preview: "",
  });
  const [pengantin1, setPengantin1] = useState({
    id: "",
    name: "",
    gender: "",
    child_number: "",
    father: "",
    mother: "",
    image: "",
  });
  const [pengantin2, setPengantin2] = useState({
    id: "",
    name: "",
    gender: "",
    child_number: "",
    father: "",
    mother: "",
    image: "",
  });

  const handleChange1 = (e) => {
    setPengantin1((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChange2 = (e) => {
    setPengantin2((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

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
        if (name == "image1") {
          setPengantin1((prev) => ({
            ...prev,
            image: fileName,
          }));
        } else {
          setPengantin2((prev) => ({
            ...prev,
            image: fileName,
          }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formId = e.target.id;
      const id = formId == "pos-1" ? pengantin1.id : pengantin2.id;

      let people;
      if (formId == "pos-1") {
        setLoading1(true);
        people = {
          name: pengantin1.name,
          gender: pengantin1.gender,
          child_number: pengantin1.child_number,
          father: pengantin1.father,
          mother: pengantin1.mother,
          image: pengantin1.image,
        };
        if (file.image1 != "") {
          const formData1 = new FormData();
          formData1.append("image_file", file.image1);
          formData1.append("id", pengantin1.id);
          await api.post(API + "/person/image", formData1);
          fileInput1.current.value = null;
        }
      } else {
        setLoading2(true);
        people = {
          name: pengantin2.name,
          gender: pengantin2.gender,
          child_number: pengantin2.child_number,
          father: pengantin2.father,
          mother: pengantin2.mother,
          image: pengantin2.image,
        };
        if (file.image2 != "") {
          const formData2 = new FormData();
          formData2.append("image_file", file.image2);
          formData2.append("id", pengantin2.id);
          await api.post(API + "/person/image", formData2);
          fileInput2.current.value = null;
        }
      }

      const response = await api.patch(API + "/person/" + id, people);
      if (response.data.success) {
        mutate("/v1/get/person");
        setShowAlert("Saved");
        setLoading1(false);
        setLoading2(false);
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
      const response = await api.get(API + "/person/" + dataUser.id);
      const data = response.data.data;
      const data1 = data.find((e) => e.pos == 1); //Pos 1
      const data2 = data.find((e) => e.pos == 2); //Pos 2
      const urlImage = API + "/images/";
      const image1Preview = data1.image != null ? urlImage + data1.image : "";
      const image2Preview = data2.image != null ? urlImage + data2.image : "";

      setFile((prev) => ({
        ...prev,
        image1: "",
        image1_preview: image1Preview,
        image2: "",
        image2_preview: image2Preview,
      }));

      setPengantin1({
        id: data1.id || "",
        name: data1.name || "",
        gender: data1.gender || "",
        child_number: data1.child_number || "",
        father: data1.father || "",
        mother: data1.mother || "",
        image: data1.image || "",
      });

      setPengantin2({
        id: data2.id || "",
        name: data2.name || "",
        gender: data2.gender || "",
        child_number: data2.child_number || "",
        father: data2.father || "",
        mother: data2.mother || "",
        image: data2.image || "",
      });

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (menu == "setting") {
      mutate("/v1/get/person");
    }
  }, [menu]);

  const { data, error, isLoading } = useSWRImmutable("/v1/get/person", fetcher);
  if (error) return <FailedToLoad />;
  if (isLoading) return <LoadingSekeleton />;

  return (
    <>
      <div className="w-full rounded-xl shadow-xl mb-6">
        <h1 className="text-2xl text-center w-full py-2 bg-gray-700">
          Pengantin
        </h1>
        <div
          className={
            "py-2 px-3 " +
            (loading1
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : "")
          }
        >
          <h2 className="text-xl text-center">Pengantin 1</h2>
          <form action="" id="pos-1" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 justify-center my-2">
              {file.image1_preview != "" && (
                <div className="avatar mx-auto py-2 md:py-0">
                  <div className="w-32 rounded-full border-4 border-white shadow-xl">
                    <img src={file.image1_preview} alt="Pengantin 1" />
                  </div>
                </div>
              )}
              <div className="text-center">
                <input
                  type="file"
                  name="image1"
                  onChange={(e) => handleChangeImage(e)}
                  accept="image/jpeg,image/png"
                  ref={fileInput1}
                  className="file-input file-input-bordered file-input-sm md:file-input-md w-full md:w-fit"
                  required={pengantin1.image === ""}
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
                  <input
                    type="text"
                    name="name"
                    value={pengantin1.name}
                    onChange={(e) => handleChange1(e)}
                    className="grow"
                    placeholder="Nama"
                    required
                  />
                </label>
              </label>
              <label htmlFor="" className="form-control w-full">
                <div className="label pb-0">
                  <span className="label-text">Anak keberapa?</span>
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="child_number"
                    value={pengantin1.child_number}
                    onChange={(e) => handleChange1(e)}
                    className="input input-sm md:input-md input-bordered grow mb-2 md:mb-0"
                    placeholder="Anak keberapa?"
                  />
                  <div className="flex flex-row items-center">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Perempuan"
                          checked={pengantin1.gender === "Perempuan"}
                          onChange={(e) => handleChange1(e)}
                          className="radio radio-sm md:radio-md checked:bg-pink-500"
                          required
                        />
                        <span className="label-text ml-1">Perempuan</span>
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Laki-laki"
                          checked={pengantin1.gender === "Laki-laki"}
                          onChange={(e) => handleChange1(e)}
                          className="radio radio-sm md:radio-md checked:bg-blue-500"
                          required
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
                    name="father"
                    value={pengantin1.father}
                    onChange={(e) => handleChange1(e)}
                    className="grow"
                    placeholder="Nama Bapak"
                    required
                  />
                </label>
                <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
                  <span>Ibu</span>
                  <input
                    type="text"
                    name="mother"
                    value={pengantin1.mother}
                    onChange={(e) => handleChange1(e)}
                    className="grow"
                    placeholder="Nama Ibu"
                    required
                  />
                </label>
              </label>
              <div className="text-right mb-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm md:btn-md"
                  disabled={loading1}
                >
                  {loading1 ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="w-full rounded-xl shadow-xl mb-6">
        <div
          className={
            "py-2 px-3 " +
            (loading2
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : "")
          }
        >
          <h2 className="text-xl text-center">Pengantin 2</h2>
          <form action="" id="pos-2" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 justify-center my-2">
              {file.image2_preview != "" && (
                <div className="avatar mx-auto py-2 md:py-0">
                  <div className="w-32 rounded-full border-4 border-white shadow-xl">
                    <img src={file.image2_preview} alt="Pengantin 1" />
                  </div>
                </div>
              )}
              <div className="text-center">
                <input
                  type="file"
                  name="image2"
                  onChange={(e) => handleChangeImage(e)}
                  accept="image/jpeg,image/png"
                  ref={fileInput2}
                  className="file-input file-input-bordered file-input-sm md:file-input-md w-full md:w-fit"
                  required={pengantin2.image === ""}
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
                  <input
                    type="text"
                    name="name"
                    value={pengantin2.name}
                    onChange={(e) => handleChange2(e)}
                    className="grow"
                    placeholder="Nama"
                    required
                  />
                </label>
              </label>
              <label htmlFor="" className="form-control w-full">
                <div className="label pb-0">
                  <span className="label-text">Anak keberapa?</span>
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="child_number"
                    value={pengantin2.child_number}
                    onChange={(e) => handleChange2(e)}
                    className="input input-sm md:input-md input-bordered grow mb-2 md:mb-0"
                    placeholder="Anak keberapa?"
                  />
                  <div className="flex flex-row items-center">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Perempuan"
                          checked={pengantin2.gender === "Perempuan"}
                          onChange={(e) => handleChange2(e)}
                          className="radio radio-sm md:radio-md checked:bg-pink-500"
                          required
                        />
                        <span className="label-text ml-1">Perempuan</span>
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Laki-laki"
                          checked={pengantin2.gender === "Laki-laki"}
                          onChange={(e) => handleChange2(e)}
                          className="radio radio-sm md:radio-md checked:bg-blue-500"
                          required
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
                    name="father"
                    value={pengantin2.father}
                    onChange={(e) => handleChange2(e)}
                    className="grow"
                    placeholder="Nama Bapak"
                    required
                  />
                </label>
                <label className="input input-sm md:input-md input-bordered flex items-center gap-2">
                  <span>Ibu</span>
                  <input
                    type="text"
                    name="mother"
                    value={pengantin2.mother}
                    onChange={(e) => handleChange2(e)}
                    className="grow"
                    placeholder="Nama Ibu"
                    required
                  />
                </label>
              </label>
              <div className="text-right mb-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm md:btn-md"
                  disabled={loading2}
                >
                  {loading2 ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Pengantin;

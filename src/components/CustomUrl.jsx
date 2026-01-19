import React, { useEffect, useState } from "react";
import FailedToLoad from "./FailedToLoad";
import LoadingSekeleton from "./LoadingSekeleton";
import api from "../utils/api";
import useSWRImmutable from "swr/immutable";
import { useSWRConfig } from "swr";

function CustomUrl({ setShowAlert, dataUser, menu }) {
  const API = import.meta.env.VITE_API_URL;
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);
  const [dataUrl, setDataUrl] = useState({
    id: "",
    url: "",
  });

  useEffect(() => {
    if (menu == "setting") {
      mutate("/v1/get/custsomUrl");
    }
  }, [menu]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.patch(`${API}/url/${dataUrl.id}`, {
        url: dataUrl.url.split("/")[3],
      });

      if (response.data.success) {
        setShowAlert("Saved");
        localStorage.setItem("customUrl", dataUrl.url.split("/")[3]);
        setLoading(false);
        const timer = setTimeout(() => {
          setShowAlert("");
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        alert(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetcher = async () => {
    try {
      const response = await api.get(API + "/url/" + dataUser.id);
      setDataUrl({
        id: response.data.data.id,
        url: window.location.origin + "/" + response.data.data.url,
      });
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, error, isLoading } = useSWRImmutable(
    "/v1/get/custsomUrl",
    fetcher,
  );

  if (error) return <FailedToLoad />;
  if (isLoading) return <LoadingSekeleton />;
  return (
    <div className="w-full rounded-xl shadow-xl mb-6">
      <h1 className="text-2xl text-center w-full py-2 bg-gray-700">
        Custom URL
      </h1>
      <div
        className={
          "py-2 px-3 " +
          (loading ? "opacity-50 cursor-not-allowed pointer-events-none" : "")
        }
      >
        <div className="my-2 text-center">
          <form action="" autoComplete="off" onSubmit={handleSubmit}>
            <label className="input input-bordered input-sm md:input-md flex items-center gap-2 mb-2">
              {/* {window.location.origin}/ */}
              <input
                type="text"
                value={dataUrl.url}
                onChange={(e) => {
                  if (e.target.value.includes(`${window.location.origin}/`)) {
                    setDataUrl((prev) => ({
                      ...prev,
                      url: e.target.value,
                    }));
                  }
                }}
                className="grow"
                placeholder="CustomURL"
                required
              />
            </label>
            <div className="text-right">
              <button
                type="submit"
                className="btn btn-primary btn-sm md:btn-md"
                disabled={
                  loading || dataUrl.url === `${window.location.origin}/`
                }
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomUrl;

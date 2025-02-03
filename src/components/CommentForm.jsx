import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";

function CommentForm({ onSubmit }) {
  const [comment, setComment] = useState({
    name: "",
    presence: "",
    text: "",
  });

  const handleChange = (e) => {
    setComment((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment);
    setComment((prev) => ({
      ...prev,
      text: "",
    }));
  };
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">
            <UserIcon className="h-4 w-4 inline mb-1 mr-1" />
            Nama Anda
          </span>
        </div>
        <input
          type="text"
          name="name"
          value={comment.name}
          onChange={(e) => handleChange(e)}
          placeholder="Isikan Nama Anda"
          className="input input-sm input-bordered w-full rounded-xl"
          required
        />
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">
            <CheckCircleIcon className="h-4 w-4 inline mb-1 mr-1" />
            Kehadiran
          </span>
        </div>
        <select
          name="presence"
          value={comment.presence}
          onChange={(e) => handleChange(e)}
          className="select select-sm select-bordered rounded-xl"
          required
        >
          <option value="" disabled>
            Konfirmasi Kehadiran
          </option>
          <option value="hadir">Hadir</option>
          <option value="mungkin">Mungkin Hadir</option>
          <option value="tidak">Tidak Hadir</option>
        </select>
      </label>
      <label className="form-control w-full mb-2">
        <div className="label">
          <span className="label-text">
            <ChatBubbleLeftRightIcon className="h-4 w-4 inline mb-1 mr-1" />
            Ucapan & Doa
          </span>
        </div>
        <textarea
          name="text"
          value={comment.text}
          onChange={(e) => handleChange(e)}
          className="textarea textarea-sm textarea-bordered h-24 rounded-xl"
          placeholder="Ucapan & Doa"
          required
        ></textarea>
      </label>
      <button
        type="submit"
        className="btn btn-primary my-4 text-white rounded-xl w-full btn-sm"
      >
        <PaperAirplaneIcon className="h-4 w-4 inline mb-1 " />
        Send
      </button>
    </form>
  );
}

export default CommentForm;

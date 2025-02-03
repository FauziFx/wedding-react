import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id"; // Opsional: Gunakan locale Indonesia

// Extend Day.js dengan plugin RelativeTime
dayjs.extend(relativeTime);
dayjs.locale("id"); // Set locale ke Indonesia

function Comment({ comment, onReply, onEdit, onDelete, currentUserId, theme }) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.text);
  const [replyText, setReplyText] = useState("");

  const handleEdit = () => {
    onEdit(comment.id, text);
    setIsEditing(false);
  };

  const handleReply = () => {
    onReply(comment.id, replyText);
    setIsReplying(false);
    setReplyText("");
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure?") == true) {
      onDelete(id);
    }
  };

  const isOwner = comment.uuid === currentUserId;
  const formattedTime = dayjs(comment.createdAt).fromNow();

  return (
    <div
      style={
        {
          // marginLeft: comment.parentId ? "20px" : "0",
          // borderLeft: comment.parentId ? "2px solid #ccc" : "none",
        }
      }
      className={
        "text-left my-2 p-4 " +
        (theme == "dark" ? "bg-gray-700" : "bg-white") +
        (comment.parentId
          ? " ml-2 border-l"
          : " rounded-2xl shadow-2xl w-11/12 md:w-4/5")
      }
    >
      {isEditing ? (
        <div>
          <div
            className={
              "flex justify-between items-center " +
              (theme == "dark" ? "text-white" : "text-gray-900")
            }
          >
            <div>
              <h2 className="font-bold inline">{comment.name}</h2>
              {comment.presence == "hadir" ? (
                <CheckCircleIcon className="h-5 w-5 inline mb-1 ml-1 text-green-500" />
              ) : comment.presence == "tidak" ? (
                <XCircleIcon className="h-5 w-5 inline mb-1 ml-1 text-red-500" />
              ) : (
                <QuestionMarkCircleIcon className="h-5 w-5 inline mb-1 ml-1 text-yellow-500" />
              )}
            </div>
            <span className="text-xs">{formattedTime}</span>
          </div>
          <hr className="border-t" />
          <div className="py-2">
            <textarea
              className="textarea textarea-sm textarea-bordered h-20 rounded-xl w-full"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <div className="text-right">
              <button
                className="btn btn-xs btn-outline rounded-badge text-white mr-1"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-xs btn-outline rounded-badge text-white"
                onClick={handleEdit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div
            className={
              "flex justify-between items-center " +
              (theme == "dark" ? "text-white" : "text-gray-900")
            }
          >
            <div>
              <h2 className="font-bold inline">{comment.name}</h2>
              {comment.presence == "hadir" ? (
                <CheckCircleIcon className="h-5 w-5 inline mb-1 ml-1 text-green-500" />
              ) : comment.presence == "tidak" ? (
                <XCircleIcon className="h-5 w-5 inline mb-1 ml-1 text-red-500" />
              ) : (
                <QuestionMarkCircleIcon className="h-5 w-5 inline mb-1 ml-1 text-yellow-500" />
              )}
            </div>
            <span className="text-xs">{formattedTime}</span>
          </div>
          <hr className="border-t" />
          <p
            className={
              "py-1 text-sm mb-1 " + (theme == "dark" ? "text-white" : "")
            }
          >
            {comment.text}
          </p>
          <button
            className="btn btn-xs btn-outline rounded-badge"
            onClick={() => setIsReplying(!isReplying)}
            disabled={isReplying === true}
          >
            Reply
          </button>
          {isOwner && (
            <>
              <button
                className="btn btn-xs btn-outline rounded-badge mx-1"
                onClick={() => setIsEditing(true)}
                disabled={isReplying === true}
              >
                Edit
              </button>
              <button
                className="btn btn-xs btn-outline rounded-badge"
                onClick={() => handleDelete(comment.id)}
                disabled={isReplying === true}
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}

      {isReplying && (
        <div className="py-2">
          <textarea
            className="textarea textarea-sm textarea-bordered h-20 rounded-xl w-full"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply"
          ></textarea>
          <div className="text-right">
            <button
              className="btn btn-xs btn-outline rounded-badge text-white mr-1"
              onClick={() => setIsReplying(!isReplying)}
            >
              Cancel
            </button>
            <button
              className="btn btn-xs btn-outline rounded-badge text-white"
              onClick={handleReply}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Render Replies */}
      {comment.replies &&
        comment.replies.map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            currentUserId={currentUserId}
            theme={theme}
          />
        ))}
    </div>
  );
}

export default Comment;

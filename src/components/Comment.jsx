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

function Comment({
  comment,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
  theme,
  loadingDelete,
}) {
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
      className={
        "text-left " +
        (theme == "dark" ? "bg-gray-700" : "bg-white") +
        (comment.parentId
          ? " pt-4 pl-4 pb-4 pr-0 ml-2 border-l"
          : " p-4 rounded-2xl shadow-2xl w-11/12 md:w-4/5 my-2")
      }
    >
      {isEditing ? (
        // Edit Comment
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
                className="btn btn-xs btn-outline rounded-badge mr-1"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-xs btn-outline rounded-badge"
                onClick={handleEdit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Text Comment
        <div className="pb-2">
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
          <div className="flex">
            {comment.Replies && (
              <button
                className="btn btn-xs btn-outline rounded-badge"
                onClick={() => setIsReplying(!isReplying)}
                disabled={isReplying === true || loadingDelete}
              >
                Reply
              </button>
            )}
            {isOwner && (
              <>
                <button
                  className="btn btn-xs btn-outline rounded-badge mx-1"
                  onClick={() => setIsEditing(true)}
                  disabled={isReplying === true || loadingDelete}
                >
                  Edit
                </button>
                <button
                  className="btn btn-xs btn-outline rounded-badge"
                  onClick={() => handleDelete(comment.id)}
                  disabled={isReplying === true || loadingDelete}
                >
                  {loadingDelete ? (
                    <>
                      <span className="loading loading-dots loading-xs inline"></span>
                      Loading
                    </>
                  ) : (
                    <>Delete</>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Reply Comment */}
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
              className="btn btn-xs btn-outline rounded-badge mr-1"
              onClick={() => setIsReplying(!isReplying)}
            >
              Cancel
            </button>
            <button
              className="btn btn-xs btn-outline rounded-badge"
              onClick={handleReply}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Render Replies */}
      {comment.Replies &&
        comment.Replies.map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            currentUserId={currentUserId}
            theme={theme}
            loadingDelete={loadingDelete}
          />
        ))}
    </div>
  );
}

export default Comment;

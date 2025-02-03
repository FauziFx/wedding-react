import React from "react";
import Comment from "./Comment";

function CommentList({
  comments,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
  theme,
}) {
  return (
    <>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUserId={currentUserId}
          theme={theme}
        />
      ))}
    </>
  );
}

export default CommentList;

import React from "react";
import Comment from "./Comment";

function CommentList({
  comments,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
  theme,
  loadingDelete,
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
          loadingDelete={loadingDelete}
        />
      ))}
    </>
  );
}

export default CommentList;

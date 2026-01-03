import { useState } from "react";
import StarRating from "@/components/modules/StarRating/StarRating";

function CommentForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitHandler = () => {
    if (!rating) {
      alert("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a comment.");
      return;
    }
    
  };

  return (
    <div className="w-full p-4 rounded-2xl border border-[#1f1f1f] bg-[#0f0f0f] space-y-4 text-center">
      <h3 className="text-lg font-semibold">Leave a Comment</h3>

      <StarRating
        rating={rating}
        hoverRating={hoverRating}
        setRating={setRating}
        setHoverRating={setHoverRating}
      />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your honest experience..."
        className="w-full h-28 p-3 bg-black border border-[#222] rounded-xl text-sm text-gray-300 resize-x-none focus:outline-none focus:ring-1 focus:ring-amber-500"
      />

      <p className="text-xs text-gray-500">
        Your comment will be visible after moderation.
      </p>
      

      <button
        onClick={submitHandler}
        className="px-6 py-2 bg-amber-500 text-black rounded-xl font-medium hover:bg-amber-400 transition"
      >
        Submit Comment
      </button>
    </div>
  );
}

export default CommentForm;

import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

import StarRating from "@/components/modules/StarRating/StarRating";
import { useAuth } from "@/Context/AuthContext";
import { autoFetch } from '@/utils/autoFetch';

let toastId = null;

function CommentForm({ productId }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  let { user } = useAuth();

  const submitHandler = async e => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    setIsSubmitting(true)

    let newCommentObj = {
      productId,
      username: user.username,
      rating,
      commentText: comment.trim()
    }

    toastId = toast.loading('Submitting Comment')

    try {
      let res = await autoFetch('/api/comments', {
        method: "POST",
        body: JSON.stringify(newCommentObj)
      })

      if (res.status == 201) {
        toast.dismiss(toastId)
        toast.success('Your comment added successfully , after approve it will be shown in comments sections')
        setRating(0)
        setComment('')

      }
    } catch (err) {
      toast.dismiss(toastId)
      toast.error(err?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={submitHandler} className="w-full p-4 rounded-2xl border border-[#1f1f1f] bg-[#0f0f0f] space-y-4 text-center">
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

      <button className="px-6 py-2 bg-amber-500 disabled:bg-amber-300 text-black rounded-xl cursor-pointer font-medium hover:bg-amber-400 transition"
        disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Comment'}
      </button>

      <Toaster
        position="top-left"
        reverseOrder={false}
      />
    </form>
  );
}

export default CommentForm;

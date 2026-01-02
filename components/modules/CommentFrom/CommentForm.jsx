import React from 'react'

function CommentForm() {
    return (
        <div className="w-full p-4 rounded-2xl border border-[#1f1f1f] bg-[#0f0f0f] space-y-4 text-center md:text-base">
            <h3 className="text-lg font-semibold">Leave a Comment</h3>

            <textarea
                placeholder="Write your honest experience..."
                className="w-full h-28 p-3 bg-black border  border-[#222] rounded-xl text-sm text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-amber-500"
            />

            <p className="text-xs text-gray-500">
                Your comment will be visible after moderation.
            </p>

            <button className="px-6 py-2 cursor-pointer bg-amber-500 text-black rounded-xl font-medium hover:bg-amber-400 transition">
                Submit Comment
            </button>
        </div>
    )
}

export default CommentForm

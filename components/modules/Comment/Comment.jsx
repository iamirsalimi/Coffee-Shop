import Link from 'next/link';
import React from 'react'

function Comment({ productId, _id: id, username, commentText, rating, createdAt, panelFlag, isApproved }) {
    function timeAgo(date) {
        const now = Date.now();
        const currentTime = new Date(date).getTime();
        const diffMs = now - currentTime

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);

        if (seconds < 60) return "just now";
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (months < 30) return `${months} month${months > 1 ? "s" : ""} ago`;

        let finalDate = new Date(date).toLocaleDateString();

        return finalDate;
    }

    return (
        <div className="p-4 border border-[#1f1f1f] rounded-2xl bg-[#0c0c0c] space-y-2">
            <div className="flex flex-col gap-2">
                <div className={`flex flex-col sm:flex-row justify-start gap-1 sm:justify-between text-sm text-gray-500`}>
                    <div className="flex items-center gap-2 justify-between sm:justify-start">
                        <span className="font-medium text-gray-300">{username}</span>
                        {panelFlag && isApproved && (
                            <Link href={`/product/${productId.slug}?q=${id}`} className="bg-black rounded-xl p-1 px-2 xs:p-2 xs:px-4 cursor-pointer text-xs xs:text-sm">visit Comment</Link>
                        )}
                        {panelFlag && !isApproved && (
                            <Link href={`/product/${productId.slug}?q=${id}`} className="text-gray-500 underline cursor-pointer text-[0.6rem] xs:text-xs">for {productId.slug}</Link>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-base">
                        <span>{timeAgo(createdAt)}</span>
                        {panelFlag && (
                            <span className={`${isApproved ? 'text-green-500' : 'text-red-500'}`}>{isApproved ? "Approved" : "Pending"}</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={`w-4 h-4 transition ${star <= rating
                                ? "fill-yellow-500 stroke-yellow-500"
                                : "fill-transparent stroke-gray-500"
                                }`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                            />
                        </svg>
                    ))}
                </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
                {commentText}
            </p>
        </div>
    )
}

export default Comment
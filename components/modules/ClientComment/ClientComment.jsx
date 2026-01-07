import { IoPerson } from "react-icons/io5";
import React from 'react'

function ServiceBox({ username, commentText , rating }) {
    return (
        <div className="relative border border-[#1f1f1f] bg-[#0f0f0f] flex flex-col items-center justify-center gap-2 rounded-4xl py-4 px-5 min-h-72 max-h-72">
            <div className="w-16 h-16 xs:w-20 xs:h-20 rounded-full bg-black flex items-center justify-center overflow-hidden ">
                <IoPerson className="text-white text-8xl relative -bottom-3" />
            </div>
            <div className="inline-flex items-center justify-center gap-0.5 text-sm">
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
            <div className="flex flex-col items-center justify-center gap-0.5">
                <h3 className="text-white font-bold text-base xs:text-lg">{username}</h3>
                <div className="text-gray-500 text-sm">
                    <span>01/05/2026</span>
                    -
                    <span>18:26</span>
                </div>
                <p className="text-gray-400 text-sm text-center mt-2 line-clamp-3">{commentText}</p>
                <button className="absolute top-2 left-2 rounded-full bg-black p-2 sm:p-4 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default ServiceBox
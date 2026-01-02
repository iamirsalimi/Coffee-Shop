import React from 'react'

import { RiScrollToBottomLine } from "react-icons/ri";

function Header() {
    return (
        <div className="pb-16 container px-5 py-1 mx-auto relative w-full min-h-screen flex flex-col md:flex-row-reverse items-center justify-start gap-4">
            {/* image */}
            <div className="w-full md:w-1/2 min-h-4/5 xs:h-full md:h-[calc(100vh-1rem)] rounded-2xl overflow-hidden">
                <img src="Images/Booking.jpg" className="object-cover object-center w-full h-full" alt="" />
            </div>
            {/* left-side header */}
            <div className="md:pr-5 w-full md:w-1/2 rounded-md flex flex-col md:items-start items-center justify-center gap-4 sm:gap-6 ">
                <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-justify text-center">Plan Your Visit</h1>
                <p className="md:text-justify text-center md:text-lg text-gray-400">Reserve a table in advance and enjoy your time without waiting. Choose a date, time, and number of guests — we’ll take care of the rest.</p>
                <div className="mt-15 w-full flex items-center justify-center gap-2 md:pb-5">
                    <RiScrollToBottomLine className="text-white text-2xl animate-bounce" />
                    <span className="text-white text-2xl ">Scroll</span>
                </div>
            </div>
        </div>
    )
}

export default Header
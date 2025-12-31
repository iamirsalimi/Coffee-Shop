import React from 'react'

function Header() {
    return (
        <div className="container px-5 py-1 mx-auto relative w-full min-h-screen flex flex-col md:flex-row-reverse items-center justify-start gap-4">
            {/* image */}
            <div className="w-full md:w-1/2 min-h-4/5 xs:h-full md:h-[calc(100vh-1rem)] rounded-2xl overflow-hidden">
                <img src="Images/HeaderImage.jpg" className="object-cover object-center w-full h-full" alt="" />
            </div>
            {/* left-side header */}
            <div className="md:pr-5 w-full md:w-1/2 rounded-md flex flex-col md:items-start items-center justify-center gap-4 sm:gap-6 ">
                <h1 className=" text-white font-bold text-3xl sm:text-4xl md:text-justify text-center">Your Daily Dose of Real Coffee</h1>
                <p className="md:text-justify text-center md:text-lg text-gray-400">We serve freshly brewed coffee made from carefully selected beans. From rich hot blends to refreshing cold drinks, every cup is crafted with care. Relax, connect, and enjoy the perfect coffee experience - just the way you like it.</p>
                <div className="flex items-center md:justify-start justify-center gap-2 pb-12 md:pb-5">
                    <button className="bg-white text-black px-4 py-2 rounded-lg font-bold border border-white cursor-pointer hover:bg-black hover:border-white hover:text-white transition-all duration-200">
                        View Menu
                    </button>
                    <button className="bg-transparent border border-white text-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-white hover:text-black transition-all duration-200">
                        Book a Table
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header
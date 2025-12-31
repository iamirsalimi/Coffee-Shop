import React from 'react'

function Footer() {
    return (
        <div className="bg-[#171717]">
            <div className="container mx-auto flex flex-col gap-2 divide-y divide-gray-800">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                    {/* left side of the footer */}
                    <div className="lg:col-start-1 lg:col-end-4 flex flex-col gap-5 py-10">
                        {/* logo */}
                        <h1 className="text-center font-bold text-3xl sm:text-5xl lg:text-left md:text-[5rem] lg:text-[6rem] xl:text-[7rem] text-white">COFFEE UNI</h1>
                        {/* links and address */}
                        <div className="grid grid-cols-3 gap-7">
                            <div className="flex flex-col items-center lg:items-start gap-2">
                                <h2 className="text-white font-bold font-sans">Navigation</h2>
                                <ul className="flex flex-col gap-1 items-center lg:items-start">
                                    <li className="text-gray-400">About</li>
                                    <li className="text-gray-400">Menu</li>
                                    <li className="text-gray-400">Contact</li>
                                    <li className="text-gray-400">booking</li>
                                </ul>
                            </div>
                            <div className="flex flex-col items-center lg:items-start gap-2">
                                <h2 className="text-white font-bold font-sans">Contact</h2>
                                <ul className="flex flex-col gap-1 items-center lg:items-start">
                                    <li className="text-gray-400">Facebook</li>
                                    <li className="text-gray-400">Instagram</li>
                                    <li className="text-gray-400">X(Twitter)</li>
                                </ul>
                            </div>
                            <div className="flex flex-col items-center lg:items-start gap-3">
                                <h2 className="text-white font-bold font-sans">Address</h2>
                                <span className="text-gray-400 text-center lg:text-left">123 high street,cambridge,CB2 1TN, United Kingdom</span>
                            </div>
                        </div>
                    </div>
                    {/* right side of the footer */}
                    <div className="lg:col-start-4 lg:col-end-6 flex flex-col gap-5 place-content-center pb-5">
                        <p className="text-gray-400 font-sans text-center lg:text-left">Coffee Uni delivers freshly roasted beans crafted with reach flavors and sustainable sourcing. Each cup is designed to inspire warmth,energy and connection.</p>
                        <p className="text-gray-400 font-sans text-center lg:text-left">We craft premium coffee daily, delivering perfect brews with passion, quality and excellence that create memorable stories in every cup.</p>

                        <button className="px-4 py-2 w-fit rounded-xl text-white font-bold bg-blue-500 cursor-pointer block mx-auto lg:mx;0">Get Started</button>
                    </div>
                </div>
                <div className="mt-auto py-2 text-white font-bold text-center">
                    built with ❤ by AmirMohammad Salimi
                </div>
            </div>
        </div>
    )
}

export default Footer
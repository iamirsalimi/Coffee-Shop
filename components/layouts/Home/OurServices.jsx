import Title from "@/components/modules/Title/Title"
import ServiceBox from "@/components/modules/ServiceBox/ServiceBox"

import { PiCoffeeBeanFill } from "react-icons/pi";
import { BiSolidHappyHeartEyes } from "react-icons/bi";
import { MdOutlineTakeoutDining } from "react-icons/md";
import { FaWifi } from "react-icons/fa6";
import React from 'react'

function OurServices() {
    return (
        <div className="py-10 w-full min-h-screen bg-black">
            <div className="container mx-auto px-5 pt-10 w-full h-full flex flex-col gap-8 items-start justify-start">
                <Title title="Our Services" />
                <p className="text-white text-lg text-center sm:text-justify">More than just coffee — we create a complete café experience.</p>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-7">
                    <ServiceBox title="Freshly Roasted Beans" description="We use high-quality beans roasted to perfection for rich and balanced flavor.">
                        <div className="min-w-16 min-h-16 xs:min-w-20 xs:min-h-20 rounded-full bg-amber-100 flex items-center justify-center">
                            <PiCoffeeBeanFill className="text-amber-900 text-xl xs:text-3xl" />
                        </div>
                    </ServiceBox>

                    <ServiceBox title="Comfortable Dine-In" description="A cozy space designed for relaxing, working, or meeting with friends.">
                        <div className="min-w-16 min-h-16 xs:min-w-20 xs:min-h-20 rounded-full bg-red-100 flex items-center justify-center">
                            <BiSolidHappyHeartEyes className="text-red-500 text-xl xs:text-3xl" />
                        </div>
                    </ServiceBox>

                    <ServiceBox title="Fast Takeaway" description="Grab your favorite coffee on the go without compromising quality.">
                        <div className="min-w-16 min-h-16 xs:min-w-20 xs:min-h-20 rounded-full bg-sky-100 flex items-center justify-center">
                            <MdOutlineTakeoutDining className="text-sky-500 text-xl xs:text-3xl" />
                        </div>
                    </ServiceBox>

                    <ServiceBox title="Free Wi-Fi" description="Stay connected while enjoying your coffee in a calm atmosphere.">
                        <div className="min-w-16 min-h-16 xs:min-w-20 xs:min-h-20 rounded-full bg-green-100 flex items-center justify-center">
                            <FaWifi className="text-green-500 text-xl xs:text-3xl" />
                        </div>
                    </ServiceBox>
                </div>
            </div>
        </div>
    )
}

export default OurServices

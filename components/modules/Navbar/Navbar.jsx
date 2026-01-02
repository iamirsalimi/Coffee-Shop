import { useState } from 'react'

import { motion } from 'motion/react'

import NavbarItem from './../NavbarItem/NavbarItem'
import Link from 'next/link'

function Navbar({ setShowMenu }) {
    const [position, setPosition] = useState({
        left: 0,
        width: 0,
        opacity: 0
    })

    return (
        <div className="absolute px-6 xl:px-2 top-2 md:top-3 xl:top-0 left-1/2 -translate-x-1/2 flex flex-column md:flex-row items-center justify-between container z-20">
            <div className="flex flex-row-reverse items-center justify-start gap-2">
                <Link href="/SignIn" className="inline-block bg-white text-black px-2 py-1 text-center rounded-xl border border-transparent font-sans text-sm xs:text-base font-bold cursor-pointer md:hover:bg-black hover:bg-transparent hover:border-white hover:text-white transition-all duration-200">
                    Sign In
                </Link>
                <h1 className="md:inline-block hidden text-white font-bold text-2xl">CoffeeUni</h1>
            </div>
            <div className="w-1/2 hidden xl:flex justify-center items-center">
                <ul
                    // when the mouse leaves the navbar we should hide our cursor
                    onMouseLeave={() => setPosition(prev => ({
                        ...prev,
                        opacity: 0
                    }))}
                    className="relative mt-2 w-fit py-1 rounded-full border bg-white hidden lg:flex items-center justify-between gap-3 p-1"
                >
                    <NavbarItem setPosition={setPosition} linkTitle="Home" />
                    <NavbarItem setPosition={setPosition} linkTitle="About" />
                    <NavbarItem setPosition={setPosition} linkTitle="Menu" />
                    <NavbarItem setPosition={setPosition} linkTitle="Booking" />
                    <NavbarItem setPosition={setPosition} linkTitle="Contact" />

                    <Cursor position={position} />
                </ul>
            </div>

            {/* hamburger menu */}
            <button
                className="xl:hidden relative cursor-pointer bg-white flex flex-col items-center justify-center gap-1 p-1 w-9 h-9 rounded-xl border border-white hover:bg-transparent group transition-all"
                onClick={e => setShowMenu(true)}
            >
                <span className="w-full h-0.5 bg-black rounded-full group-hover:bg-white transition-all"></span>
                <span className="w-full h-0.5 bg-black rounded-full group-hover:bg-white transition-all"></span>
            </button>
        </div>
    )
}

const Cursor = ({ position }) => {
    return (
        <motion.li
            animate={position}
            className="absolute z-0 block h-10 w-20 bg-black rounded-full"
        ></motion.li>
    )
}

export default Navbar
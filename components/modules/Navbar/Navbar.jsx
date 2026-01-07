import { useState } from 'react'

import { motion } from 'motion/react'

import NavbarItem from './../NavbarItem/NavbarItem'
import Link from 'next/link'
import { useAuth } from '@/Context/AuthContext'

function Navbar({ setShowMenu, setShowBasketMenu, paddingFlag }) {
    const [position, setPosition] = useState({
        left: 0,
        width: 0,
        opacity: 0
    })

    const { user } = useAuth()

    return (
        <div className={`w-full h-fit flex items-center py-2 ${paddingFlag ? '' : 'pt-2'} absolute z-20 top-0 md:top-3 xl:top-0 left-1/2 -translate-x-1/2 ${paddingFlag ? 'border-b border-[#1f1f1f]' : ''}`}>
            <div className={`${paddingFlag ? 'px-5 xs:px-0 ' : 'px-6 '}xl:px-2 flex flex-column md:flex-row items-center justify-between container mx-auto`}>

                <div className="flex flex-row-reverse items-center justify-start gap-2">

                    <div className="flex flex-row-reverse items-center gap-1">
                        {user && (
                            <>
                                <button
                                    onClick={() => setShowBasketMenu(true)}
                                    className="inline-block bg-white text-black px-2 py-1 text-center rounded-xl border border-transparent font-sans text-sm xs:text-base font-bold cursor-pointer md:hover:bg-black hover:bg-transparent hover:border-white group transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-black w-6 h-6 group-hover:text-white transition-colors duration-200">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                </button>
                                <button
                                    className="inline-flex items-center justify-center gap-1 bg-white text-black px-2 py-1 text-center rounded-xl border border-transparent font-sans text-sm xs:text-base font-bold cursor-pointer md:hover:bg-black hover:bg-transparent hover:border-white group transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-black w-6 h-6 group-hover:text-white transition-colors duration-200">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />

                                    </svg>
                                    {/* <div className="text-black group-hover:text-white transition-colors duration-200">{user.role.toString().toLowerCase()}Panel</div> */}
                                </button>
                            </>
                        )}
                        {!user && (
                            <Link href="/SignIn" className="inline-block bg-white text-black px-2 py-1 text-center rounded-xl border border-transparent font-sans text-sm xs:text-base font-bold cursor-pointer md:hover:bg-black hover:bg-transparent hover:border-white hover:text-white transition-all duration-200">
                                Sign In
                            </Link>
                        )}
                    </div>

                    <h1 className="md:inline-block hidden text-white font-bold text-2xl">CoffeeUni</h1>
                </div>
                <div className={`w-1/2 hidden xl:flex ${paddingFlag ? 'justify-end' : 'justify-center'} items-center relative z-50`}>
                    <ul
                        // when the mouse leaves the navbar we should hide our cursor
                        onMouseLeave={() => setPosition(prev => ({
                            ...prev,
                            opacity: 0
                        }))}
                        className="relative w-fit py-1 rounded-full border bg-white hidden lg:flex items-center justify-between gap-3 p-1"
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
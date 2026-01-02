import React from 'react'
// import { motion , AnimationPresence } from 'motion/react';
import { motion, AnimatePresence } from 'motion/react'
// import { RxCross2 } from "react-icons/rx";

import Link from 'next/link'

const Menu = ({ showMenu, setShowMenu }) => {

    const hideMenu = () => setShowMenu(false)

    return (
        <>
            <AnimatePresence >
                {showMenu && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black py-2 px-5 flex flex-col place-content-start gap-2 xl:hidden h-screen"
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{
                            duration: 0.6,
                            ease: 'easeInOut'
                        }}
                    >
                        {/* header of the navbar */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <motion.h3
                                className="text-gray-200 text-3xl font-bold"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55, duration: 0.4 }}
                            >CoffeeUni</motion.h3>
                            <button
                                className="cursor-pointer p-2 rounded-md hover:bg-white/5 transition-colors duration-200"
                                onClick={e => setShowMenu(false)}
                            >
                                <motion.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6 text-white text-2xl"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.55, duration: 0.4 }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18 18 6M6 6l12 12"
                                    />
                                </motion.svg>
                            </button>
                        </div>

                        {/* links */}
                        <RevealLinks hideMenu={hideMenu} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}


const RevealLinks = ({hideMenu}) => {
    return (
        <section className="h-full w-full flex flex-col place-content-start gap-7 py-12 text-gray-500">
            <Link 
                href="/"
                onClick={hideMenu}
            >
                <FlipLink index={1}>Home</FlipLink>
            </Link>
            <Link 
                href="/About"
                onClick={hideMenu}
            >
                <FlipLink index={2}>About</FlipLink>
            </Link>
            <Link 
                href="/Menu"
                onClick={hideMenu}
            >
                <FlipLink index={3}>Menu</FlipLink>
            </Link>
            <Link 
                href="/Booking"
                onClick={hideMenu}
            >
                <FlipLink index={5}>Booking</FlipLink>
            </Link>
            <Link 
                href="/Contact"
                onClick={hideMenu}
            >
                <FlipLink index={4}>Contact</FlipLink>
            </Link>
        </section>
    );
};

const DURATION = 0.25;
const STAGGER = 0.025;
const STAGGERInitial = 0.05;

const FlipLink = ({ children, href, index }) => {
    return (
        <motion.div
            className=""
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 + (index * STAGGERInitial), duration: 0.4 }}
        >
            <motion.span
                initial="initial"
                whileHover="hovered"
                href={href}
                className="relative block overflow-hidden whitespace-nowrap text-3xl md:text-[2.5rem] xs:text-4xl font-black uppercase sm:text-6xl"
                style={{
                    lineHeight: 0.75,
                }}
            >
                <div>
                    {children.split("").map((l, i) => (
                        <motion.span
                            variants={{
                                initial: {
                                    y: 0,
                                },
                                hovered: {
                                    y: "-120%",
                                },
                            }}
                            transition={{
                                duration: DURATION,
                                ease: "easeInOut",
                                delay: STAGGER * i,
                            }}
                            className="inline-block"
                            key={i}
                        >
                            {l}
                        </motion.span>
                    ))}
                </div>
                <div className="absolute inset-0 text-white">
                    {children.split("").map((l, i) => (
                        <motion.span
                            variants={{
                                initial: {
                                    y: "100%",
                                },
                                hovered: {
                                    y: 0,
                                },
                            }}
                            transition={{
                                duration: DURATION,
                                ease: "easeInOut",
                                delay: STAGGER * i,
                            }}
                            className="inline-block"
                            key={i}
                        >
                            {l}
                        </motion.span>
                    ))}
                </div>
            </motion.span>
        </motion.div>
    );
};

export default Menu
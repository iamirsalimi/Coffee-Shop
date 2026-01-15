import React, { useState } from 'react'

import Link from 'next/link';

import { useAuth } from '@/Context/AuthContext';

import LogoutModal from '../LogoutModal/LogoutModal';

import { FaUser } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { HiMenu } from "react-icons/hi";
import { AiOutlineComment } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";
import { IoIosAddCircleOutline } from "react-icons/io";

let links = [
    { title: 'Dashboard', href: '/p-admin/', icon: <LuLayoutDashboard className="text-white text-xl" /> },
    { title: 'Profile Edit', href: '/p-admin/profile-edit', icon: <IoSettingsOutline className="text-white text-xl" /> },
    { title: 'Users', href: '/p-admin/users', icon: <FaUsers className="text-white text-xl" /> },
    {
        title: 'Products', href: '/p-admin/products', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-white w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
    },
    { title: 'Orders', href: '/p-admin/orders', icon: <IoIosAddCircleOutline className="text-white text-xl" /> },
    { title: 'Bookings', href: '/p-admin/booking', icon: <BsCalendarDate className="text-white text-xl" /> },
    { title: 'Comments', href: '/p-admin/comments', icon: <AiOutlineComment className="text-white text-xl" /> },
    { title: 'Contacts', href: '/p-admin/contacts', icon: <AiOutlineComment className="text-white text-xl" /> },
]

function PanelSideBar() {
    const [showMenu, setShowMenu] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    let { user, logout } = useAuth();

    const logoutUser = async () => {
        setIsLoggingOut(true)
        await logout()
        setIsLoggingOut(false)
        setShowLogoutModal(false)
    }

    const hideMenu = () => {
        setShowMenu(false)
    }

    return (
        <>
            <div className={`w-full z-50 fixed left-0 top-0 ${showMenu ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 transition-all duration-300 bg-black shadow shadow-black/5 dark:bg-secondary lg:w-1/4 h-screen `}>
                <div className="px-5 py-9 flex flex-col justify-start items-center gap-5 overflow-y-scroll lg:overflow-hidden">
                    <button className="block lg:hidden w-fit absolute top-1 right-1 p-1 rounded-sm  border border-[#1f1f1f] bg-[#0f0f0f] text-white cursor-pointer" onClick={hideMenu}>
                        <RxCross2 className="text-xl" />
                    </button>

                    <div className="flex flex-col items-center gap-5">
                        <div className="relative w-24 h-24 rounded-full bg-gray-800 overflow-hidden ring-8 ring-gray-700/25">
                            <FaUser className="text-white absolute -bottom-10 left-1/2 -translate-1/2 w-20 h-20" />
                        </div>
                        <h2 className="text-light-gray dark:text-white">{user?.firstname || ''} {user?.lastname || ''}</h2>
                    </div>
                    <div className="w-full flex items-center justify-center gap-4">
                        <Link href='/p-admin/bookings' className="relative flex items-center p-2 xl:p-3 rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] cursor-pointer transition-all group">
                            <BsCalendarDate className="text-white text-2xl" />
                            <span className="inline-block opacity-0 h-5 absolute left-1/2 -top-5 -translate-1/2  border border-[#1f1f1f] bg-[#0f0f0f] px-2 py-0.5 rounded-md text-xs text-nowrap z-20 group-hover:opacity-100 transition-all">Bookings</span>
                        </Link
                        >
                        <Link href='/p-admin/orders' className="relative flex items-center p-2 xl:p-3 rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] cursor-pointer transition-all group">
                            <IoIosAddCircleOutline className="text-white text-2xl" />
                            <span className="inline-block opacity-0 h-5 absolute left-1/2 -top-5 -translate-1/2  border border-[#1f1f1f] bg-[#0f0f0f] px-2 py-0.5 rounded-md text-xs text-nowrap z-20 group-hover:opacity-100 transition-all">Orders</span>
                        </Link>

                        <button
                            className="relative flex items-center p-2 xl:p-3 rounded-xl  border border-[#1f1f1f] bg-[#0f0f0f] cursor-pointer transition-all group"
                            onClick={e => setShowLogoutModal(true)}
                        >
                            <TbLogout2 className='text-red-500 text-2xl' />
                            <span className="inline-block opacity-0 h-5 absolute left-1/2 -top-5 -translate-1/2  border border-[#1f1f1f] bg-[#0f0f0f] px-2 py-0.5 rounded-md text-xs dark:text-white text-nowrap z-20 group-hover:opacity-100 transition-all">Log out</span>
                        </button>
                    </div>

                    {/* panel links */}
                    <div className="grid grid-cols-2 gap-2 w-full">
                        {links.map(link => {
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={` border border-[#1f1f1f] bg-[#0f0f0f] transition-colors duration-250 py-3 px-2 rounded-lg cursor-pointer flex flex-col items-center gap-1 `}
                                >
                                    {link.icon}
                                    <span className="text-white text-xs text-center">{link.title}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="w-full h-fit flex items-center justify-between z-10 fixed bottom-0 left-0 border border-[#1f1f1f] bg-[#0f0f0f] shadow shadow-black/25 dark:bg-secondary px-3 xs:px-5 py-4 lg:hidden">

                <a href="/my-account/userPanel/" className="flex flex-col items-center justify-center gap-1">
                    <LuLayoutDashboard className={`text-light-gray dark:text-white text-xl xs:text-2xl text-white`} />
                    <span className={`text-xs xs:text-sm text-white`}>Dashboard</span>
                </a>

                <a href="/my-account/userPanel/profile-edit" className="flex flex-col items-center justify-center gap-1">
                    <IoSettingsOutline className={`text-light-gray dark:text-white text-xl xs:text-2xl text-white`} />
                    <span className={`text-xs xs:text-sm text-white`}>Profile Edit</span>
                </a>

                <a href="/my-account/userPanel/messages" className="relative flex flex-col items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-white w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <span className={`text-xs xs:text-sm text-white`}>Cart</span>
                </a>

                <div
                    className="my-account/userPanel/flex flex-col items-center justify-center gap-1 cursor-pointer"
                    onClick={e => setShowLogoutModal(true)}
                >
                    <TbLogout2 className='text-red-500 text-xl xs:text-2xl' />
                    <span className="text-light-gray dark:text-white text-xs xs:text-sm">Logout</span>
                </div>

                <button
                    href="#"
                    className="absolute top-2 left-1/2 -translate-1/2 p-3 py-2 rounded-full border-t border-b-transparent border-[#1f1f1f] bg-[#0f0f0f]  dark:bg-secondary flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => setShowMenu(true)}
                >
                    <HiMenu className='text-light-gray dark:text-white text-3xl' />
                </button>
            </div>

            <LogoutModal showModal={showLogoutModal} setShowModal={setShowLogoutModal} isLoggingOut={isLoggingOut} logoutHandler={logoutUser} />
        </>
    )
}

export default PanelSideBar
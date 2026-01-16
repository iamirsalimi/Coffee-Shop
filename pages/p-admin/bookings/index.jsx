import React, { useState, useEffect } from 'react'

import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

import AdminPanelSideBar from '@/components/modules/AdminPanelSideBar/AdminPanelSideBar';
import DeleteModal from '@/components/modules/deleteModal/DeleteModal'

import Users from '@/src/Models/User';
import Bookings from '@/src/Models/Booking';
import { verifyRefreshToken } from '@/src/utils/auth';

import { PiEyeBold } from "react-icons/pi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";

let toastId = null;

export async function getServerSideProps(context) {
    try {
        let { refreshToken } = context.req.cookies

        if (!refreshToken) {
            return {
                redirect: { destination: '/' }
            }
        }

        let tokenPayload = verifyRefreshToken(refreshToken)

        if (!tokenPayload) {
            return {
                redirect: { destination: '/' }
            }
        }

        let user = await Users.findOne({ _id: tokenPayload.userId })
        let bookings = await Bookings.find({})

        if (user.role == 'USER') {
            return {
                redirect: { destination: '/p-user' }
            }
        }

        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                bookings: JSON.parse(JSON.stringify(bookings)),
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function AllBookings({ user, bookings }) {
    const [filteredBookings, setFilteredBookings] = useState(bookings)
    const [search, setSearch] = useState('') // username or fullname or phone
    const [filterType, setFilterType] = useState('username') // username or fullname or phone or status or today or tomorrow
    const [filterBookingStatus, setFilterBookingStatus] = useState('PENDING') // PENDING or CONFIRMED or CANCELED
    const [isPending, setIsPending] = useState(false)

    const getMonth = date => {
        if (!date) return ''
        let registerDate = new Date(date)

        let day = registerDate.getDate();
        let month = registerDate.getMonth() + 1;
        let year = registerDate.getFullYear();

        return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`
    }

    function timeLeft(date, dayFlag) {
        const now = Date.now();
        const bookingTime = new Date(date).getTime();
        const diffMs = bookingTime - now // we wanna find out how many days left to booking 

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (seconds < 60) return "just now";
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (dayFlag) {
            if (hours > 24 && hours < 48) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        }

        return false;
    }

    const changeBookingStatus = async (booking, statusFlag) => {
        try {
            toastId = toast.loading(`${statusFlag}ing booking`)
            let newBooking = { status: statusFlag == 'confirm' ? 'CONFIRMED' : 'CANCELED', time: booking.time }
            setIsPending(true)

            let res = await fetch(`/api/booking/${booking._id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBooking)
            })

            // let resData = await res.json()
            // console.log(resData)

            if (res.status == 200) {
                setIsPending(false)
                toast.dismiss(toastId)
                toast.success(`booking ${statusFlag}ed successfully`)
                location.reload()
            }

        } catch (err) {
            setIsPending(false)
            toast.dismiss(toastId)
            toast.error(err.message)
            console.log(err)
        }
    }

    useEffect(() => {
        if (['username', 'fullname', 'phone'].includes(filterType)) {
            if (search.trim()) {
                setFilteredBookings(bookings.filter(booking => booking[filterType].toLowerCase().includes(search.toLowerCase())))
            } else {
                setFilteredBookings(bookings)
            }
        } else if (filterType == 'today') {
            setSearch('')
            setFilteredBookings(bookings.filter(booking => Boolean(timeLeft(booking.date))))
        } else if (filterType == 'tomorrow') {
            setSearch('')
            setFilteredBookings(bookings.filter(booking => Boolean(timeLeft(booking.date, true))))
        } else if (filterType == 'status') {
            setSearch('')
            setFilteredBookings(bookings.filter(booking => booking.status == filterBookingStatus))
        } else {
            setFilteredBookings(bookings)
        }
    }, [search, filterType, filterBookingStatus])

    // console.log(bookings)

    return (
        <div className="flex gap-5 min-h-screen pb-20 md:pb-10 xl:pb-0">
            <AdminPanelSideBar />
            <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">

                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                        <span className="text-xs xs:text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Bookings</span>
                </div>

                <div className="flex flex-col items-center justify-center gap-2">

                    <div className="flex flex-col-reverse md:flex-row items-center md:justify-between gap-9 md:gap-2 w-full border border-[#1f1f1f] p-4 pt-10 rounded-3xl bg-black">
                        {filterType != 'status' ? (
                            <div className="w-full relative select-none">
                                <input
                                    type="text"
                                    className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                    value={search}
                                    onChange={e => setSearch(e.target.value.trim())}
                                    placeholder={!['today', 'tomorrow'].includes(filterType) ? ` booking's ${filterType}...` : "today's bookings"}
                                    disabled={['today', 'tomorrow'].includes(filterType)}
                                />
                                <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0  px-2 bg-black text-gray-500">Search</span>
                            </div>
                        ) : (
                            <div className="relative w-full">
                                <select
                                    id="filterSelect"
                                    className="p-4 w-full rounded-full text-white border border-[#1f1f1f] bg-[#0f0f0f]"
                                    value={filterBookingStatus}
                                    onChange={e => setFilterBookingStatus(e.target.value)}
                                >

                                    <option value="PENDING">pending</option>
                                    <option value="CANCELED">canceled</option>
                                    <option value="CONFIRMED">confirmed</option>
                                </select>
                                <label
                                    htmlFor='filterSelect'
                                    className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0  px-2 bg-black text-gray-500"
                                >Filter Type</label>
                            </div>
                        )}
                        <div className="relative w-full md:w-1/3">
                            <select
                                id="filterSelect"
                                className="p-4 w-full rounded-full text-white border border-[#1f1f1f] bg-[#0f0f0f]"
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                            >
                                <option value="username">username</option>
                                <option value="fullname">fullname</option>
                                <option value="phone">phone</option>
                                <option value="status">status</option>
                                <option value="today">today</option>
                                <option value="tomorrow">tomorrow</option>
                            </select>
                            <label
                                htmlFor='filterSelect'
                                className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0  px-2 bg-black text-gray-500"
                            >Filter Type</label>
                        </div>
                    </div>
                    <div className="w-full min-h-[65vh] max-h-[65vh] py-3 px-2 rounded-3xl border border-[#1f1f1f] bg-black overflow-auto mb-20">

                        <table className="w-full">
                            <thead className="min-w-full">
                                <tr className="py-1 px-2">
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">index</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">username</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">fullName</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">phone</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">description</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">guests</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">status</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">date</th>
                                    <th className="py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center pt-4">
                                {filteredBookings?.length > 0 && filteredBookings.map((booking, index) => (
                                    <tr key={booking?._id} className="py-1 px-2 text-center text-gray-400  hover:text-white hover:bg-white/5 transition-colors select-none" >
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{index + 1}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{booking?.username}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{booking?.fullname}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{booking.phone}</td>
                                        <td className="py-1 pb-3 px-2 text-sm min-w-52 max-w-52">{booking.description}</td>
                                        <td className="py-1 pb-3 px-2 text-sm">{booking.guests}</td>
                                        <td className={`text-nowrap py-1 pb-3 px-2 text-sm ${booking?.status == 'CONFIRMED' ? 'text-green-500' : booking.status == 'Canceled' ? 'text-red-500' : 'text-amber-500'}`}>{booking.status}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{getMonth(booking.date)} {booking.time}</td>
                                        <td className="py-1 pb-3 px-2 text-sm flex flex-col items-center justify-center gap-4">
                                            <a
                                                href={`/p-admin/bookings/${booking?._id}`}
                                                className="inline-flex items-center justify-center gap-1 p-1 lg:px-2 rounded-md cursor-pointer bg-sky-500/10 hover:bg-sky-500/25 transition-colors group"
                                            >
                                                <FaEye className="text-sky-500 group-hover:text-white transition-all" />
                                                <span className="text-sky-500 group-hover:text-white transition-colors ">details</span>
                                            </a>
                                            {booking.status == "PENDING" && (
                                                <div className="grid grid-cols-2 gap-2 min-w-52">
                                                    <button
                                                        className="inline-flex items-center justify-center gap-1 p-1 lg:px-2 rounded-md cursor-pointer border border-green-500 bg-green-500/10 disabled:bg-green/5 hover:bg-green-500/25 transition-colors group"
                                                        onClick={e => changeBookingStatus(booking, 'confirm')}
                                                        disabled={isPending}
                                                    >
                                                        <FiCheck className="text-green-500 group-hover:text-white transition-all" />
                                                        <span className="text-green-500 group-hover:text-white transition-colors text-nowrap">{isPending ? 'pending' : "confirm"}</span>
                                                    </button>
                                                    <button
                                                        className="inline-flex items-center justify-center gap-1 p-1 lg:px-2 rounded-md cursor-pointer border border-red-500 bg-red-500/10 disabled:bg-red-500/5 hover:bg-red-500/25 transition-colors group"
                                                        onClick={e => changeBookingStatus(booking, 'cancel')}
                                                        disabled={isPending}
                                                    >
                                                        <RxCross1 className="text-red-500 group-hover:text-white transition-all" />
                                                        <span className="text-red-500 group-hover:text-white transition-colors text-nowrap">{isPending ? 'pending' : "cancel"}</span>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredBookings?.length == 0 && (
                            <div className="text-center text-white my-auto mt-36">there is no booking {['username', 'fullname', 'phone'].includes(filterType) ? `with "${search}" ${filterType}` : filterType == 'status' ? `with "${filterBookingStatus}" status` : 'for today'} </div>
                        )}
                    </div>
                </div >
            </div >

            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </div >
    )
}

AllBookings.noLayout = true

export default AllBookings
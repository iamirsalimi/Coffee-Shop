import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

import AdminPanelSideBar from '@/components/modules/AdminPanelSideBar/AdminPanelSideBar';

import Users from '@/src/Models/User';
import Bookings from '@/src/Models/Booking';
import { verifyRefreshToken } from '@/src/utils/auth';
import {autoFetch} from '@/utils/autoFetch';

import { MdKeyboardArrowLeft } from "react-icons/md";

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

        if (user.role == 'USER') {
            return {
                redirect: { destination: '/p-user' }
            }
        }

        let { bookingId } = context.query

        let booking = await Bookings.findOne({ _id: bookingId });
        if (!booking) {
            return {
                redirect: { destination: '/p-admin/bookings' }
            }
        }

        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                booking: JSON.parse(JSON.stringify(booking)),
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function BookingDetails({ user, booking }) {
    const [status, setStatus] = useState(booking?.status)
    const [time, setTime] = useState(booking?.time)
    const [isChangingStatus, setIsChangingStatus] = useState(false)
    const [isChangingTime, setIsChangingTime] = useState(false)

    const getMonth = (date, withoutTimeFlag) => {
        // console.log(date)
        if (!date) return ''
        let registerDate = new Date(date)

        let day = registerDate.getDate();
        let month = registerDate.getMonth() + 1;
        let year = registerDate.getFullYear();

        let hours = registerDate.getHours() < 10 ? `0${registerDate.getHours()}` : registerDate.getHours();
        let minute = registerDate.getMinutes() < 10 ? `0${registerDate.getMinutes()}` : registerDate.getMinutes();

        return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}${!withoutTimeFlag ? ` ${hours}:${minute}` : ''}`
    }

    // function timeLeft(date) {
    //     const now = Date.now();
    //     const bookingTime = new Date(date).getTime();
    //     const diffMs = bookingTime - now // we wanna find out how many days left to booking 

    //     if(diffMs <= 0) return false;

    //     const seconds = Math.floor(diffMs / 1000);
    //     const minutes = Math.floor(seconds / 60);
    //     const hours = Math.floor(minutes / 60);
    //     const days = Math.floor(hours / 24);

    //     return `${days} day${days > 1 ? "s" : ""} ago`;
    // }

    const updateBooking = async (newBooking, updateFlag) => {
        try {
            if (updateFlag == 'status') {
                toastId = toast.loading('updating status')
                setIsChangingStatus(true)
            } else {
                toastId = toast.loading('updating time')
                setIsChangingTime(true)
            }

            let res = await autoFetch(`/api/booking/${booking._id}`, {
                method: "PATCH",
                body: JSON.stringify(newBooking)
            })


            if (res.status == 200) {
                toast.dismiss(toastId)
                toast.success(`booking's ${updateFlag} updated successfully`)
                location.reload()
            }

        } catch (err) {
            toast.dismiss(toastId)
            toast.error(err.message)
            console.log(err)
        } finally {
            setIsChangingStatus(false)
            setIsChangingTime(false)
        }
    }

    let updateStatusHandler = async () => {
        let newBooking = { time: booking.time, status }
        await updateBooking(newBooking, 'status')
    }

    let updateTimeHandler = async () => {
        let newBooking = { status: booking.status, time }
        await updateBooking(newBooking, 'time')
    }

    // console.log(booking)

    return (
        <div className="flex gap-5 min-h-screen pb-20 md:pb-10 lg:pb-0">
            <AdminPanelSideBar />
            <Head>
                <title>Coffee Uni | {booking.username}</title>
            </Head>
            <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">

                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                        <span className="text-xs xs:text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Booking Details</span>
                </div>

                <div className="p-4 border border-[#1f1f1f] rounded-2xl bg-black space-y-2 pt-10">
                    <div className="flex flex-col gap-2">
                        <Link href={`/p-admin/users/${booking.username}`} className="font-medium text-white underline text-sm xs:text-base md:text-lg lg:text-xl select-none">{booking?.username}</Link>
                        <div className="flex flex-col items-start gap-2 text-xs md:text-sm lg:text-base text-nowrap">
                            <div className="flex items-center gap-1 flex-wrap select-none">
                                <h2 className="text-gray-400">status : </h2>
                                <span className={`${booking?.status == 'CONFIRMED' ? 'text-green-500' : booking?.status == 'CANCELED' ? 'text-red-500' : 'text-yellow-500'} select-none text-xs md:text-sm lg:text-base`}>{booking.status}</span>
                            </div>
                            <div className="flex items-center gap-0.5 text-xs md:text-sm lg:text-base text-nowrap">
                                <h2 className="text-gray-400">fullname : </h2>
                                <span>{booking?.fullname}</span>
                            </div>
                            <div className="flex items-center gap-0.5 text-xs md:text-sm lg:text-base text-nowrap">
                                <h2 className="text-gray-400">Guests : </h2>
                                <span>{booking?.guests}</span>
                            </div>
                            <div className="flex items-center gap-0.5 text-xs md:text-sm lg:text-base text-nowrap">
                                <h2 className="text-gray-400">Date : </h2>
                                <span>{getMonth(booking?.date, true)}</span>
                            </div>
                            <div className="flex items-center gap-0.5 text-xs md:text-sm lg:text-base text-nowrap">
                                <h2 className="text-gray-400">time : </h2>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="time"
                                        className="w-full rounded-2xl p-2 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                        value={time}
                                        onChange={e => setTime(e.target.value.trim())}
                                    />
                                    <button
                                        className="p-3 w-full md:w-fit rounded-3xl cursor-pointer bg-amber-500 disabled:bg-amber-300 hover:bg-amber-600 transition-colors text-black font-bold self-start text-nowrap text-sm -mt-5 md:mt-0"
                                        onClick={updateTimeHandler}
                                        disabled={isChangingTime}
                                    >{isChangingTime ? 'changing Time...' : 'change time'}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm md:text-lg text-white leading-relaxed select-none">
                        {booking?.description}
                    </p>
                    <div className="w-full flex flex-col xs:flex-row items-center gap-2 mt-10">
                        <div className="relative w-full">
                            <select
                                id="filterSelect"
                                className="p-4 w-full rounded-full text-white border border-[#1f1f1f] bg-[#0f0f0f] text-sm"
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                            >
                                <option value="PENDING">pending</option>
                                <option value="CANCELED">canceled</option>
                                <option value="CONFIRMED">confirmed</option>
                            </select>
                            <label
                                htmlFor='filterSelect'
                                className="absolute peer-focus:text-sky-500 transition-all -top-5 left-1/2 -translate-x-1/2  bg-black text-gray-500 text-nowrap text-xs"
                            >Comment Approval</label>
                        </div>
                        <button
                            className="p-3.5 h-full w-full rounded-3xl cursor-pointer bg-amber-500 disabled:bg-amber-300 hover:bg-amber-600 transition-colors text-black font-bold self-start text-nowrap text-sm md:mt-0 block"
                            onClick={updateStatusHandler}
                            disabled={isChangingStatus}
                        >{isChangingStatus ? 'changing status...' : 'change status'}</button>
                    </div>
                </div>
            </div >
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </div >
    )
}

BookingDetails.noLayout = true

export default BookingDetails
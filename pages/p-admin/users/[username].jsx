import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import toast from 'react-hot-toast';
import Link from 'next/link';

import Users from '@/src/Models/User';
import { verifyRefreshToken } from '@/src/utils/auth';

import AdminPanelSideBar from '@/components/modules/AdminPanelSideBar/AdminPanelSideBar';
import OrderBox from '@/components/modules/OrderBox/OrderBox';

import { PiEyeBold } from "react-icons/pi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaBan } from "react-icons/fa";
import { useRouter } from 'next/router';
import { FaUser } from "react-icons/fa";


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

        let { username } = context.query
        console.log('username', username)

        let mainUser = await Users.findOne({ username }).populate({
            path: "cart.items.product",
        }).populate({
            path: "comments",
        }).populate({
            path: "bookings",
        }).populate({
            path: "orders",
        }).lean()

        if (!mainUser) {
            console.log('mainUser ', mainUser)
            return {
                redirect: { destination: '/p-admin/users' }
            }
        }

        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                mainUser: JSON.parse(JSON.stringify(mainUser))
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function UserDetails({ user, mainUser }) {
    // let { user } = useAuth()

    const errorNotify = text => {
        toast.error(text)
    }

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

    return (
        <div className="flex gap-5 min-h-screen pb-20 md:pb-10 lg:pb-0">
            <AdminPanelSideBar />
            <Head>
                <title>Coffee Uni | {mainUser.username}</title>
            </Head>
            <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">
                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                        <span className="text-xs xs:text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold text-xs xs:text-sm sm:text-base">User Details</span>
                </div>

                <div className="w-full min-h-[80vh] max-h-[80vh] p-5 rounded-3xl border border-[#1f1f1f] bg-black overflow-auto">
                    <div className="w-full grid grid-cols-1 gap-5">
                        <div className="min-w-max !w-full min-h-[60vh] max-h-[60vh] grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {/* user account details */}
                            <div className="w-full flex flex-col items-center gap-5 py-5 px-2 rounded-3xl border border-[#1f1f1f] bg-[#0f0f0f]">
                                <div className="flex flex-col items-center gap-5">
                                    <div className="relative w-20 h-20 rounded-full bg-gray-800 overflow-hidden ring-4 ring-gray-700/25">
                                        <FaUser className="text-white absolute -bottom-10 left-1/2 -translate-1/2 w-16 h-16" />
                                    </div>
                                    <h2 className="text-white font-bold select-none">{mainUser?.firstname || ''} {mainUser?.lastname || ''}</h2>
                                </div>
                                <div className="flex flex-col gap-2 select-none">
                                    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 text-sm py-1">
                                        <h3 className="font-bold text-gray-400">FullName : </h3>
                                        <p className="font-bold text-white">{mainUser?.firstname} {mainUser?.lastname}</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 text-sm py-1">
                                        <h3 className="font-bold text-gray-400">userName : </h3>
                                        <p className="font-bold text-white">{mainUser?.username}</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 text-sm py-1">
                                        <h3 className="font-bold text-gray-400">email : </h3>
                                        <p className="font-bold text-white">{mainUser?.email}</p>
                                    </div>
                                </div>
                            </div>
                            {/* user basket */}
                            <div className="lg:col-start-2 lg:col-end-4 flex flex-col items-start gap-5 py-5 px-4 rounded-3xl border border-[#1f1f1f] bg-[#0f0f0f] overflow-y-auto">
                                <h2 className="text-white font-bold select-none">User Basket</h2>
                                <div className="w-full flex flex-col items-center justify-between gap-2 select-none">
                                    {mainUser.cart.items.length > 0 ? mainUser.cart.items.map(cart => (
                                        <div className="w-full flex items-center justify-between text-sm">
                                            <h3 className="font-bold text-gray-400">{cart.product.title}</h3>
                                            <p className="font-bold text-white">{cart.quantity} <span className="text-gray-400">cups</span></p>
                                            <p className="font-bold text-white">{cart.size} <span className="text-gray-500">(${cart.size == 'SMALL' ? cart.product.smallPrice : cart.size == 'MEDIUM' ? cart.product.mediumSize : cart.product.largeSize})</span></p>
                                            <p className="font-bold text-white"><span className="text-gray-400 text-xs">$</span>{cart.price.toFixed(2)}</p>
                                        </div>
                                    )) : (
                                        <div className="text-white text-center my-auto">User Basket Is Empty</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* user orders */}
                        <div className="min-h-[65vh] max-h-[65vh] flex flex-col items-start gap-5 py-5 px-4 rounded-3xl border border-[#1f1f1f] bg-[#0f0f0f] overflow-y-auto">
                            <h2 className="text-white font-bold select-none">User Orders</h2>
                            <div className="w-full flex flex-col items-center justify-between gap-2 select-none">
                                {mainUser?.orders.length > 0 ? mainUser?.orders.map(order => (
                                    <OrderBox key={order._id} {...order} />
                                )) : (
                                    <div className="text-center text-white my-auto">user haven't ordered anything yet</div>
                                )}
                            </div>
                        </div>
                        {/* user comments */}
                        <div className="min-h-[65vh] max-h-[65vh] flex flex-col items-start gap-5 py-5 px-4 rounded-3xl border border-[#1f1f1f] bg-[#0f0f0f] overflow-y-auto">
                            <h2 className="text-white font-bold select-none">User Comments</h2>
                            <div className="w-full h-full flex flex-col items-center justify-between gap-2 select-none overflow-auto">
                                <table className="w-full">
                                    <thead className="min-w-full">
                                        <tr className="py-1 px-2">
                                            <th className="text-nowrap py-1 pb-3 px-2 text-sm text-gray-400">index</th>
                                            <th className="text-nowrap py-1 pb-3 px-2 text-sm text-gray-400">userName</th>
                                            <th className="text-nowrap py-1 pb-3 px-2 text-sm text-gray-400">rating</th>
                                            <th className="text-nowrap py-1 pb-3 px-2 text-sm text-gray-400 max-w-36">commentText</th>
                                            <th className="text-nowrap py-1 pb-3 px-2 text-sm text-gray-400">status</th>
                                            <th className="text-nowrap py-1 pb-3 px-2 text-sm text-gray-400">createdAt</th>
                                            {/* <th className="py-1 pb-3 px-2 text-sm text-gray-400">Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="text-center pt-4">
                                        {mainUser?.comments.length > 0 && mainUser?.comments.map((comment, index) => (
                                            <tr key={user?.id} className="py-1 px-2 text-center text-gray-400  hover:text-white hover:bg-white/5 transition-colors select-none" >
                                                <td className="text-nowrap py-1 pb-3 px-2 text-sm">{index + 1}</td>
                                                <td className="text-nowrap py-1 pb-3 px-2 text-sm">{comment?.username}</td>
                                                <td className="text-nowrap py-1 pb-3 px-2 text-sm">{comment?.rating}</td>
                                                <td className="py-1 pb-3 px-2 text-sm max-w-36">{comment?.commentText}</td>
                                                <td className={`text-nowrap py-1 pb-3 px-2 text-sm ${comment?.isApproved ? 'text-green-500' : 'text-red-500'}`}>{comment?.isApproved ? 'Approved' : 'Pending'}</td>
                                                <td className="text-nowrap py-1 pb-3 px-2 text-sm">{getMonth(comment?.createdAt)}</td>
                                                {/* <td className="py-1 pb-3 px-2 text-sm flex items-center justify-center gap-1">
                                                    <a
                                                        href={`/p-admin/users/${comment?.username}`}
                                                        className="inline-flex items-center gap-1 p-1 lg:px-2 rounded-md cursor-pointer bg-green-500/10 hover:bg-green-500/25 transition-colors group"
                                                    >
                                                        <FaEye className="text-green-500 group-hover:text-white transition-all" />
                                                        <span className="text-green-500 group-hover:text-white transition-colors ">details</span>
                                                    </a>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {mainUser?.comments.length == 0 && (
                                    <div className="text-center text-white my-auto">user haven't left a comment yet</div>
                                )}
                            </div>
                        </div>
                        {/* user bookings */}
                        <div className="min-h-[65vh] max-h-[65vh] flex flex-col items-start gap-5 py-5 px-4 rounded-3xl border border-[#1f1f1f] bg-[#0f0f0f] overflow-y-auto">
                            <h2 className="text-white font-bold select-none">User bookings</h2>
                            <div className="w-full h-full flex flex-col items-center justify-between gap-2 select-none overflow-auto">
                                <table className="w-full">
                                    <thead className="min-w-full">
                                        <tr className="py-1 px-2">
                                            <th className="text-nowrap py-1 pb-3 px-2 text-sm text-gray-400">index</th>
                                            <th className="text-nowrap py-1 pb-3 px-2 text-sm text-gray-400">fullName</th>
                                            <th className="text-nowrap py-1 pb-3 px-2 text-sm text-gray-400">phone</th>
                                            <th className="text-nowrap py-1 pb-3 px-2 text-sm text-gray-400">guests</th>
                                            <th className="text-nowrap py-1 pb-3 px-2 text-sm text-gray-400 max-w-36">description</th>
                                            <th className="text-nowrap py-1 pb-3 px-2 text-sm text-gray-400">status</th>
                                            <th className="text-nowrap py-1 pb-3 px-2 text-sm text-gray-400">createdAt</th>
                                            {/* <th className="py-1 pb-3 px-2 text-sm text-gray-400">Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="text-center pt-4">
                                        {mainUser?.bookings.length > 0 && mainUser?.bookings.map((booking, index) => (
                                            <tr key={user?.id} className="py-1 px-2 text-center text-gray-400  hover:text-white hover:bg-white/5 transition-colors select-none" >
                                                <td className="text-nowrap py-1 pb-3 px-2 text-sm">{index + 1}</td>
                                                <td className="text-nowrap py-1 pb-3 px-2 text-sm">{booking?.fullname}</td>
                                                <td className="text-nowrap py-1 pb-3 px-2 text-sm">{booking?.phone}</td>
                                                <td className="text-nowrap py-1 pb-3 px-2 text-sm">{booking?.guests}</td>
                                                <td className="py-1 pb-3 px-2 text-sm max-w-36">{booking?.description}</td>
                                                <td className={`text-nowrap py-1 pb-3 px-2 text-sm ${booking?.status == 'PENDING' ? 'text-amber-500' : booking?.status == 'CONFIRMED' ? 'text-green-500' : 'text-red-500'}`}>{booking?.status == 'PENDING' ? 'Pending' : booking?.status == 'CONFIRMED' ? 'Confirmed' : 'Canceled'}</td>
                                                <td className="text-nowrap py-1 pb-3 px-2 text-sm">{getMonth(booking?.date, true)} {booking.time}</td>
                                                {/* <td className="py-1 pb-3 px-2 text-sm flex items-center justify-center gap-1">
                                                    <a
                                                        href={`/p-admin/users/${booking?.username}`}
                                                        className="inline-flex items-center gap-1 p-1 lg:px-2 rounded-md cursor-pointer bg-green-500/10 hover:bg-green-500/25 transition-colors group"
                                                    >
                                                        <FaEye className="text-green-500 group-hover:text-white transition-all" />
                                                        <span className="text-green-500 group-hover:text-white transition-colors ">details</span>
                                                    </a>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {mainUser?.bookings.length == 0 && (
                                    <div className="text-center text-white my-auto">user haven't booked anything yet</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

UserDetails.noLayout = true

export default UserDetails
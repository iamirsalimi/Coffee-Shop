import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

import AdminPanelSideBar from '@/components/modules/AdminPanelSideBar/AdminPanelSideBar';
import DeleteModal from '@/components/modules/deleteModal/DeleteModal'

import Users from '@/src/Models/User';
import Orders from '@/src/Models/Order';
import { verifyRefreshToken } from '@/src/utils/auth';

import { PiEyeBold } from "react-icons/pi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaBan } from "react-icons/fa";

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
        let orders = await Orders.find({}).populate('userId').lean();

        if (user.role == 'USER') {
            return {
                redirect: { destination: '/p-user' }
            }
        }

        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                orders: JSON.parse(JSON.stringify(orders)),
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function AllOrders({ user, orders }) {
    const [filteredOrders, setFilteredOrders] = useState(orders)
    const [search, setSearch] = useState('') // username
    const [filterType, setFilterType] = useState('username') // username or today

    const getMonth = date => {
        // console.log(date)
        if (!date) return ''
        let registerDate = new Date(date)

        let day = registerDate.getDate();
        let month = registerDate.getMonth() + 1;
        let year = registerDate.getFullYear();

        let hours = registerDate.getHours() < 10 ? `0${registerDate.getHours()}` : registerDate.getHours();
        let minute = registerDate.getMinutes() < 10 ? `0${registerDate.getMinutes()}` : registerDate.getMinutes();

        return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year} ${hours}:${minute}`
    }

    const calcTotalPrice = (orders) => {
        let totalPrice = orders.reduce((prev, cur) => prev + (cur.quantity * cur.price), 0).toFixed(2)
        return totalPrice
    }

    function timeAgo(date) {
        const now = Date.now();
        const currentTime = new Date(date).getTime();
        const diffMs = now - currentTime

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (seconds < 60) return "just now";
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

        return false;
    }

    useEffect(() => {
        switch (filterType) {
            case "username": {
                if (search.trim()) {
                    setFilteredOrders(orders.filter(order => order.userId.username.toLowerCase().includes(search.toLowerCase())))
                } else {
                    setFilteredOrders(orders)
                }
                break;
            }

            case "today": {
                setFilteredOrders(orders.filter(order => Boolean(timeAgo(order.createdAt))))
                break;
            }

            default: {
                setFilteredOrders(orders)
            }
        }
    }, [search, filterType])

    // console.log(orders)

    return (
        <div className="flex gap-5 min-h-screen pb-20 md:pb-10 lg:pb-0">
            <AdminPanelSideBar />

            <Head>
                <title>Coffee Uni | Orders</title>
            </Head>

            <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">

                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                        <span className="text-xs xs:text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Orders</span>
                </div>

                <div className="flex flex-col items-center justify-center gap-2">

                    <div className="flex flex-col-reverse md:flex-row items-center md:justify-between gap-9 md:gap-2 w-full border border-[#1f1f1f] p-4 pt-10 rounded-3xl bg-black">
                        <div className="w-full relative select-none">
                            <input
                                type="text"
                                className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                value={search}
                                onChange={e => setSearch(e.target.value.trim())}
                                placeholder={` order's ${filterType}...`}
                                disabled={filterType == 'today'}
                            />
                            <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0  px-2 bg-black text-gray-500">Search</span>
                        </div>
                        <div className="relative w-full md:w-fit">
                            <select
                                id="filterSelect"
                                className="p-4 w-full rounded-full text-white border border-[#1f1f1f] bg-[#0f0f0f]"
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                            >
                                <option value="username">username</option>
                                <option value="today">today</option>
                            </select>
                            <label
                                htmlFor='filterSelect'
                                className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0  px-2 bg-black text-gray-500"
                            >Filter Type</label>
                        </div>
                    </div>
                    <div className="w-full min-h-[65vh] max-h-[65vh] py-3 px-2 rounded-3xl border border-[#1f1f1f] bg-black overflow-auto">

                        <table className="w-full">
                            <thead className="min-w-full">
                                <tr className="py-1 px-2">
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">index</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">username</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">orders</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">totalPrice</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">isDelayed</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">createdAt</th>
                                    <th className="py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center pt-4">
                                {filteredOrders?.length > 0 && filteredOrders.map((order, index) => (
                                    <tr key={order?._id} className="py-1 px-2 text-center text-gray-400  hover:text-white hover:bg-white/5 transition-colors select-none" >
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{index + 1}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{order?.userId.username}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{order?.orders.length}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm"><span className="text-gray-400 text-sm">$</span>{calcTotalPrice(order.orders)}</td>
                                        <td className={`text-nowrap py-1 pb-3 px-2 text-sm ${order?.isDelayed ? 'text-green-500' : 'text-red-500'}`}>{order?.isDelayed ? `true (${order.minutesDelayed} minutes)` : 'false'}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{getMonth(order.createdAt)}</td>
                                        <td className="py-1 pb-3 px-2 text-sm flex items-center justify-center gap-1">
                                            <a
                                                href={`/p-admin/orders/${order?._id}`}
                                                className="inline-flex items-center gap-1 p-1 lg:px-2 rounded-md cursor-pointer bg-green-500/10 hover:bg-green-500/25 transition-colors group"
                                            >
                                                <FaEye className="text-green-500 group-hover:text-white transition-all" />
                                                <span className="text-green-500 group-hover:text-white transition-colors ">details</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredOrders?.length == 0 && (
                            <div className="text-center text-white my-auto mt-36">there is no order {filterType == 'username' ? `with "${search}" ${filterType}` : 'for today'} </div>
                        )}
                    </div>
                </div >
            </div >
        </div >
    )
}

AllOrders.noLayout = true

export default AllOrders
import React, { useEffect, useState } from 'react'
import Link from 'next/link';

import AdminPanelSideBar from '@/components/modules/AdminPanelSideBar/AdminPanelSideBar';
import DashboardInfoBox from '@/components/modules/DashboardInfoBox/DashboardInfoBox';

import { MdKeyboardArrowLeft } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineComment } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";

import { verifyRefreshToken } from '@/src/utils/auth';

import Users from '@/src/Models/User';
import Comments from '@/src/Models/Comment';
import Orders from '@/src/Models/Order';
import Bookings from '@/src/Models/Booking';

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
        // console.log(user, user.role)
        
        let users = await Users.find({})
        let comments = await Comments.find({});
        let bookings = await Bookings.find({});
        let orders = await Orders.find({}).populate('userId');

        if (user.role == 'USER') {
            return {
                redirect: { destination: '/p-user' }
            }
        }

        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                users: JSON.parse(JSON.stringify(users)),
                comments: JSON.parse(JSON.stringify(comments)),
                bookings: JSON.parse(JSON.stringify(bookings)),
                orders: JSON.parse(JSON.stringify(orders))
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function index({ user, users , comments, orders, bookings }) {
    const getMonth = date => {
        if (!date) return ''
        let registerDate = new Date(date)

        let day = registerDate.getDate();
        let month = registerDate.getMonth() + 1;
        let year = registerDate.getFullYear();
        return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`
    }

    return (
        <div className="flex gap-5 max-h-fit lg:max-h-screen overflow-hidden pb-20 md:pb-10 lg:pb-0">
            <AdminPanelSideBar />
            <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">

                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-2xl" />
                        <span className="text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold">Dashboard</span>
                </div>

                <div className="flex flex-col gap-10 min-h-[80vh] lg:max-h-[80vh] place-content-start lg:pr-5 p-5 rounded-3xl bg-black overflow-y-auto">
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <DashboardInfoBox title="All Comments" value={comments?.length || 0} color="from-purple-400 to-purple-500 "  >
                            <AiOutlineComment className="text-white text-xl lg:text-2xl xl:text-3xl" />
                        </DashboardInfoBox>

                        <DashboardInfoBox title="All users" value={users?.length || 0} color="from-green-400 to-green-500 "  >
                            <FaUsers className="text-white text-xl lg:text-2xl xl:text-3xl" />
                        </DashboardInfoBox>

                        <DashboardInfoBox title="All Orders" value={orders?.length || 0} color="from-orange-400 to-orange-500 "  >
                            <IoIosAddCircleOutline className="text-white text-xl lg:text-2xl xl:text-3xl" />
                        </DashboardInfoBox>

                        <DashboardInfoBox title="All Bookings" value={bookings?.length || 0} color="from-red-400 to-red-500 "  >
                            <BsCalendarDate className="text-white text-xl lg:text-2xl xl:text-3xl" />
                        </DashboardInfoBox>
                    </div>

                    <div className="w-full min-h-full grid grid-cols-1 lg:grid-cols-3 grid-rows-3 lg:grid-rows-2 gap-5">
                        <div className="lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-3 flex flex-col gap-5 border border-[#1f1f1f] p-4 rounded-2xl">
                            <h2 className="text-white text-xl font-bold text-center md:text-left">Bookings</h2>
                            <table className="">
                                <thead className="border-b border-[#1f1f1f]">
                                    <tr className="pb-12">
                                        <th className="text-gray-500 font-bold">FullName</th>
                                        <th className="text-gray-500 font-bold">Guests</th>
                                        <th className="text-gray-500 font-bold">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {bookings?.map(booking => (
                                        <tr className="pt-5">
                                            <td className="text-white font-bold text-center">{booking.fullname}</td>
                                            <td className="text-white font-bold text-center">{booking.guests}</td>
                                            <td className="text-white font-bold text-center">{getMonth(booking.date)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {bookings?.length == 0 && (
                                <div className="text-white text-center my-auto">there is no booking</div>
                            )}
                        </div>
                        <div className="border border-[#1f1f1f] rounded-2xl p-4 flex flex-col gap-2">
                            <h2 className="text-white font-bold">Your Account Details</h2>
                            <div className="flex flex-col gap-1 divide-y divide-[#1f1f1f]">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm py-1">
                                    <h3 className="font-bold text-gray-400">FullName : </h3>
                                    <p className="font-bold text-white">{user?.firstname} {user?.lastname}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm py-1">
                                    <h3 className="font-bold text-gray-400">userName : </h3>
                                    <p className="font-bold text-white">{user?.username}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm py-1">
                                    <h3 className="font-bold text-gray-400">email : </h3>
                                    <p className="font-bold text-white">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="border border-[#1f1f1f] rounded-2xl p-4 flex flex-col gap-2">
                            <h2 className="text-white font-bold">Orders</h2>
                            <div className="flex flex-col gap-1 divide-y divide-[#1f1f1f]">
                                {orders?.length > 0 ? orders.slice(-4).map(order => (
                                    <div className="flex items-center justify-between text-sm line-clamp-1">
                                        <h3 className="font-bold text-gray-400 text-sm">{order.userId.username}</h3>
                                        <p className="font-bold text-white text-xs"><span className="text-gray-400 text-[0.7rem]">$</span>{order.totalPrice.toFixed(2)}</p>
                                        {order.isDelayed && (
                                            <p className="font-bold text-white text-xs">delayed for{order.minutesDelayed}minutes</p>
                                        )}
                                    </div>
                                )) : (
                                    <div className="text-white text-center my-auto">Your basket is Empty</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

index.noLayout = true

export default index
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '@/Context/AuthContext';
import { useBasket } from '@/Context/BasketContext';

import PanelSideBar from '@/components/modules/PanelSideBar/PanelSideBar';
import DashboardInfoBox from '@/components/modules/DashboardInfoBox/DashboardInfoBox';

import { MdKeyboardArrowLeft } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { PiUserFocusFill } from "react-icons/pi";
import { AiOutlineComment } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";

import Users from '@/src/Models/User'
import { verifyRefreshToken } from '@/src/utils/auth';

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
        console.log(user, user.role)

        if (user.role == 'ADMIN') {
            return {
                redirect: { destination: '/p-admin' }
            }
        }

        return {
            props: {

            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function index() {
    const { user, loading } = useAuth();
    const { basket } = useBasket();

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
            <PanelSideBar />
            <Head>
                <title>Coffee Uni | Dashboard</title>
            </Head>
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
                        <DashboardInfoBox title="Comments" value={user?.comments.length || 0} color="from-purple-400 to-purple-500 "  >
                            <AiOutlineComment className="text-white text-xl lg:text-2xl xl:text-3xl" />
                        </DashboardInfoBox>

                        <DashboardInfoBox title="Register" value={getMonth(user?.createdAt) || "25/01/2026"} color="from-green-400 to-green-500 "  >
                            <PiUserFocusFill className="text-white text-xl lg:text-2xl xl:text-3xl" />
                        </DashboardInfoBox>

                        <DashboardInfoBox title="Orders" value={user?.orders.length || 0} color="from-orange-400 to-orange-500 "  >
                            <IoIosAddCircleOutline className="text-white text-xl lg:text-2xl xl:text-3xl" />
                        </DashboardInfoBox>

                        <DashboardInfoBox title="Booking" value={user?.bookings.length || 0} color="from-red-400 to-red-500 "  >
                            <BsCalendarDate className="text-white text-xl lg:text-2xl xl:text-3xl" />
                        </DashboardInfoBox>
                    </div>

                    <div className="w-full min-h-full grid grid-cols-1 lg:grid-cols-3 grid-rows-3 lg:grid-rows-2 gap-5">
                        <div className="lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-3 flex flex-col gap-5 border border-[#1f1f1f] p-4 rounded-2xl">
                            <h2 className="text-white text-xl font-bold text-center md:text-left">Bookings History</h2>
                            <table className="">
                                <thead className="border-b border-[#1f1f1f]">
                                    <tr className="pb-12">
                                        <th className="text-gray-500 font-bold">FullName</th>
                                        <th className="text-gray-500 font-bold">Guests</th>
                                        <th className="text-gray-500 font-bold">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {!loading && user?.bookings.map(booking => (
                                        <tr className="pt-5">
                                            <td className="text-white font-bold text-center">{booking.fullname}</td>
                                            <td className="text-white font-bold text-center">{booking.guests}</td>
                                            <td className="text-white font-bold text-center">{getMonth(booking.date)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!loading && user?.bookings.length == 0 && (
                                <div className="text-white text-center my-auto">Your haven't booked anything yet</div>
                            )}

                            {loading && (
                                <div className="text-white my-auto text-center">Loading...</div>
                            )}
                        </div>
                        <div className="border border-[#1f1f1f] rounded-2xl p-4 flex flex-col gap-2">
                            <h2 className="text-white font-bold">Your Account Details</h2>
                            <div className="flex flex-col gap-1 divide-y divide-[#1f1f1f]">
                                {!loading ? (
                                    <>
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
                                    </>
                                ) : (
                                    <div className="text-white my-auto text-center">Loading...</div>
                                )}
                            </div>
                        </div>
                        <div className="border border-[#1f1f1f] rounded-2xl p-4 flex flex-col gap-2">
                            <h2 className="text-white font-bold">Your Basket</h2>
                            <div className="flex flex-col gap-1 divide-y divide-[#1f1f1f]">
                                {!loading ? (
                                    <>
                                        {basket.length > 0 ? basket.slice(-4).map(basketProduct => (
                                            <div className="flex items-center justify-between text-sm">
                                                <h3 className="font-bold text-gray-400">{basketProduct.product.title}</h3>
                                                <p className="font-bold text-white">{basketProduct.size}</p>
                                                <p className="font-bold text-white"><span className="text-gray-400 text-xs">$</span>{basketProduct.price.toFixed(2)}</p>
                                            </div>
                                        )) : (
                                            <div className="text-white text-center my-auto">Your basket is Empty</div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-white my-auto text-center">Loading...</div>
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


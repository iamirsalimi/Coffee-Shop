import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

import AdminPanelSideBar from '@/components/modules/AdminPanelSideBar/AdminPanelSideBar';

import Users from '@/src/Models/User';
import Orders from '@/src/Models/Order';
import { verifyRefreshToken } from '@/src/utils/auth';



import { PiEyeBold } from "react-icons/pi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaBan } from "react-icons/fa";
import { useRouter } from 'next/router';

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

        let { orderId } = context.query

        let order = await Orders.findOne({ _id: orderId }).populate('userId').lean();

        if (!order) {
            return {
                redirect: { destination: '/p-admin/orders' }
            }
        }

        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                order: JSON.parse(JSON.stringify(order)),
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function OrderDetails({ user, order }) {
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

    const getTotalItems = orders => {
        let ordersCount = orders.reduce((prev, cur) => prev + cur.quantity, 0)
        return ordersCount
    }

    const getTotalPrice = orders => {
        let totalPrice = orders.reduce((prev, cur) => prev + (cur.quantity * cur.price), 0)
        return totalPrice
    }


    console.log(order)

    return (
        <div className="flex gap-5 min-h-screen pb-20 md:pb-10 lg:pb-0">
            <AdminPanelSideBar />
            <Head>
                <title>Coffee Uni | {order.userId.username}</title>
            </Head>

            <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">

                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                        <span className="text-xs xs:text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Order Details</span>
                </div>

                <div className="flex flex-col items-center justify-center gap-2">
                    <div
                        key={order.id}
                        className="p-4 border border-[#1f1f1f] rounded-3xl bg-black space-y-0.5 w-full"
                    >
                        <div className={`flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 text-xs text-gray-500`}>
                            <div className="flex items-center justify-between w-full">
                                <Link href={`/p-admin/users/${order.userId.username}`} className="font-medium text-gray-300 text-sm xs:text-base select-none">{order.userId.username}</Link>
                                {order.isDelayed && (
                                    <span className="text-gray-500 text-xs lg:text-sm">Delayed for {order.minutesDelayed} minutes</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap select-none">
                            <div className="flex items-center gap-0.5 text-xs text-nowrap">
                                <h2 className="text-gray-400">Total Items : </h2>
                                <span>{getTotalItems(order.orders)}</span>
                            </div>
                            -
                            <div className="flex items-center gap-0.5 text-xs text-nowrap">
                                <h2 className="text-gray-400">Total Price : </h2>
                                <span><span className="text-gray-400 text-[0.7rem]">$</span>{getTotalPrice(order.orders).toFixed(2)}</span>
                            </div>
                            -
                            <div className="flex items-center gap-0.5 text-xs text-nowrap">
                                <h2 className="text-gray-400">Date : </h2>
                                <span>{getMonth(order.createdAt)}</span>
                            </div>
                        </div>
                        <p className="text-sm text-white leading-relaxed select-none">
                            {order.description}
                        </p>
                        <div
                            className="mt-2 bg-[#0c0c0c] rounded-3xl border border-[#1f1f1f] p-4 flex flex-col gap-5 overflow-hidden"
                        >
                            {order.orders.map(orderedProduct => (
                                <div className={`flex flex-col xs:flex-row gap-5 xs:h-40 w-full rounded-2xl`}>
                                    <div className="xs:max-w-1/3 max-h-72 xs::max-h-40 rounded-xl overflow-hidden w-full h-full">
                                        <img src={orderedProduct.product.image} className="object-cover object-center w-full h-full" alt="" />
                                    </div>
                                    <div className="h-full w-full flex flex-col justify-start gap-5 pr-2">
                                        <div className="w-full flex flex-row items-center justify-between">
                                            <h2 className="text-white text-xs xs:text-sm sm:text-base text-nowrap">Product Name :</h2>
                                            <Link href={`/p-admin/products/${orderedProduct.product.slug}`} className="text-gray-500 text-xs xs:text-sm sm:text-base">{orderedProduct.product.title}</Link>
                                        </div>

                                        {/* Size */}
                                        <div className="w-full flex flex-row items-center justify-between">
                                            <h2 className="text-white text-nowrap text-xs xs:text-sm sm:text-base">Size :</h2>
                                            <p className="text-gray-500 text-xs xs:text-sm sm:text-base">{orderedProduct.size}</p>
                                        </div>

                                        {/* Quantity */}
                                        <div className="w-full flex flex-row items-center justify-between">
                                            <h2 className="text-white text-nowrap text-xs xs:text-sm sm:text-base">Quantity :</h2>
                                            <p className="text-xs xs:text-sm sm:text-base text-white ">{orderedProduct.quantity}</p>
                                        </div>

                                        {/* price */}
                                        <div className="w-full flex flex-row items-center justify-between">
                                            <h2 className="text-white text-nowrap text-xs xs:text-sm sm:text-base">Price :</h2>
                                            <p className="text-xs xs:text-sm sm:text-base text-white "><span className="text-gray-400">$</span>{(orderedProduct.quantity * orderedProduct.price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div >
            </div >
        </div >
    )
}

OrderDetails.noLayout = true

export default OrderDetails
import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

import AdminPanelSideBar from '@/components/modules/AdminPanelSideBar/AdminPanelSideBar';

import Users from '@/src/Models/User';
import Products from '@/src/Models/Product';
import { verifyRefreshToken } from '@/src/utils/auth';



import { PiEyeBold } from "react-icons/pi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaBan } from "react-icons/fa";
import { useRouter } from 'next/router';
import Image from 'next/image';

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

        let { slug } = context.query

        let product = await Products.findOne({ slug }).populate('comments').lean();

        if (!product) {
            return {
                redirect: { destination: '/p-admin/products' }
            }
        }


        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                product: JSON.parse(JSON.stringify(product)),
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function ProductDetails({ user, product }) {
    function timeAgo(date) {
        const now = Date.now();
        const currentTime = new Date(date).getTime();
        const diffMs = now - currentTime

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);

        if (seconds < 60) return "just now";
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

        return `${months} month${months > 1 ? "s" : ""} ago`;

        let finalDate = new Date(date).toLocaleDateString();

        return finalDate;
    }

    console.log(product)

    return (
        <div className="flex gap-5 min-h-screen pb-20 md:pb-10 lg:pb-0">
            <AdminPanelSideBar />
            <Head>
                <title>Coffee Uni | {product.title}</title>
            </Head>
            <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">

                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                        <span className="text-xs xs:text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Product Details</span>
                </div>

                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-full min-h-[75vh] py-3 px-2 rounded-3xl border border-[#1f1f1f] bg-black overflow-auto">
                        <div className="w-full h-full pb-3">
                            <div className="container mx-auto w-full h-full flex flex-col lg:flex-row justify-start gap-5">
                                <div className="w-full lg:w-1/2 h-[calc(100vh)] md:h-[calc(100vh)] md:max-h-[150vh] lg:h-full rounded-xl overflow-hidden">
                                    <Image
                                        src={product.image}
                                        className="w-full h-full object-cover object-center"
                                        alt="product Image"
                                        width={1000}
                                        height={500}
                                    />
                                </div>

                                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-5 lg:gap-2 !pr-3 lg:px-0">
                                    <div className="w-full flex items-center justify-between">
                                        <h2 className="text-white font-sans font-bold text-lg">title : </h2>
                                        <p className="text-gray-400 font-sans text-lg">{product.title}</p>
                                    </div>

                                    <div className="w-full flex flex-col items-start justify-center gap-1">
                                        <h2 className="text-white font-sans font-bold text-lg">summary : </h2>
                                        <p className="text-gray-400 text-center lg:text-justify">{product.summary}</p>
                                    </div>

                                    <div className="w-full flex flex-col items-start justify-center gap-1">
                                        <h2 className="text-white font-sans font-bold text-lg">description : </h2>
                                        <p className="text-gray-400 text-center lg:text-justify">{product.description}</p>
                                    </div>

                                    <div className="w-full flex items-center justify-between">
                                        <h2 className="text-white font-sans font-bold text-lg">ingredients : </h2>
                                        <p className="text-gray-400 text-center lg:text-justify">{product.ingredients.join(',')}</p>
                                    </div>

                                    <div className="w-full flex items-center justify-between">
                                        <h2 className="text-white font-sans font-bold text-lg">category : </h2>
                                        <p className="text-gray-400 font-sans text-lg">{product.category}</p>
                                    </div>

                                    <div className="w-full flex items-center justify-between">
                                        <h2 className="text-white font-sans font-bold text-lg">slug : </h2>
                                        <p className="text-gray-400 font-sans text-lg">{product.slug}</p>
                                    </div>

                                    {/* product Sizes */}
                                    <div className="w-full p-4 border border-[#1f1f1f] rounded-2xl space-y-3.5 bg-[#0f0f0f]">
                                        <h2 className="text-lg font-semibold text-white">
                                            Price Per Size
                                        </h2>

                                        <ul className="flex flex-col gap-2 text-sm text-gray-400 list-disc">
                                            <li className="w-full flex items-center justify-between">
                                                <span>Small : </span>
                                                <span>${product.smallPrice.toFixed(2)}</span>
                                            </li>
                                            <li className="w-full flex items-center justify-between">
                                                <span>Medium : </span>
                                                <span>${product.mediumPrice.toFixed(2)}</span>
                                            </li>
                                            <li className="w-full flex items-center justify-between">
                                                <span>Large : </span>
                                                <span>${product.largePrice.toFixed(2)}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center md:items-start gap-5 mt-10 px-3">
                                <h2 className="w-full text-white text-2xl text-center md:text-left lg:text-4xl font-bold">Reviews</h2>
                                <div className="w-full flex flex-col-reverse gap-2">
                                    {product.comments.map(comment => (
                                        <div className="p-4 border border-[#1f1f1f] rounded-3xl bg-[#0c0c0c] space-y-2">
                                            <div className="flex flex-col gap-2">
                                                <div className={`flex flex-col sm:flex-row justify-start gap-1 sm:justify-between text-sm text-gray-500`}>
                                                    <div className="flex items-center gap-2 justify-between sm:justify-start">
                                                        <Link href={`/p-user/${comment.username}`} className="font-medium text-gray-300">{comment.username}</Link>
                                                        {comment.isApproved && (
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Link
                                                                    href={`/product/${product.slug}?q=${comment._id}`} className="bg-black rounded-xl p-1 xs:p-1.5 cursor-pointer text-xs xs:text-sm"
                                                                >visit Comment</Link>

                                                                <button
                                                                    className="bg-red-500/5 hover:bg-red-500/10 transition-colors border border-red-500 text-red-500 font-bold text-center p-1.5 rounded-xl cursor-pointer">Not Approved</button>
                                                            </div>
                                                        )}
                                                        {!comment.isApproved && (
                                                            <button className="bg-green-500/5 hover:bg-green-500/10 border border-green-500 transition-colors text-green-500 font-bold text-center p-1.5 rounded-xl cursor-pointer">Approved</button>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 text-xs sm:text-base">
                                                        <span>{timeAgo(comment.createdAt)}</span>
                                                        <span className={`${comment.isApproved ? 'text-green-500' : 'text-red-500'}`}>{comment.isApproved ? "Approved" : "Pending"}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className={`w-4 h-4 transition ${star <= comment.rating
                                                                ? "fill-yellow-500 stroke-yellow-500"
                                                                : "fill-transparent stroke-gray-500"
                                                                }`}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                                            />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                {comment.commentText}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                {product.comments.length == 0 && (
                                    <div className="w-full text-center border border-[#1f1f1f] rounded-2xl bg-[#0c0c0c] p-4">
                                        There is no comment for this product
                                    </div>
                                )}
                            </div>
                            <Toaster
                                position="top-left"
                                reverseOrder={false}
                            />
                        </div>
                    </div>
                </div >
            </div >
        </div >
    )
}

ProductDetails.noLayout = true

export default ProductDetails
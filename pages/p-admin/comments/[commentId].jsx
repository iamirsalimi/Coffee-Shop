import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

import AdminPanelSideBar from '@/components/modules/AdminPanelSideBar/AdminPanelSideBar';

import Users from '@/src/Models/User';
import Comments from '@/src/Models/Comment';
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

        let { commentId } = context.query

        let comment = await Comments.findOne({ _id: commentId }).populate('productId');
        if (!comment) {
            return {
                redirect: { destination: '/p-admin/comments' }
            }
        }

        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                comment: JSON.parse(JSON.stringify(comment)),
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function CommentDetails({ user, comment }) {
    const [approval, setApproval] = useState(comment?.isApproved ? 'approved' : 'notApproved')
    const [isChangingApproval, setIsChangingApproval] = useState(false)

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

    const updateComment = async () => {
        try {
            let newComment = { isApproved: approval == 'approved' }

            if (approval == 'approved' && comment.isApproved) {
                toast.error("comment's approval is same as before")
                return false;
            }
            if (approval == 'notApproved' && !comment.isApproved) {
                toast.error("comment's approval is same as before")
                return false;
            }
            toastId = toast.loading('updating approval')
            setIsChangingApproval(true)


            let res = await autoFetch(`/api/comments/${comment._id}`, {
                method: "PATCH",
                body: JSON.stringify(newComment)
            })


            if (res.status == 200) {
                toast.dismiss(toastId)
                toast.success("comment's approval updated successfully")
                location.reload()
            }

        } catch (err) {
            toast.dismiss(toastId)
            toast.error(err.message)
            console.log(err)
        } finally {
            setIsChangingApproval(false)
        }
    }

    // console.log(comments)

    return (
        <div className="flex gap-5 min-h-screen pb-20 md:pb-10 lg:pb-0">
            <AdminPanelSideBar />
            <Head>
                <title>Coffee Uni | {comment.username}</title>
            </Head>
            <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">

                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                        <span className="text-xs xs:text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Comments Details</span>
                </div>

                <div className="p-4 border border-[#1f1f1f] rounded-2xl bg-black space-y-2 pt-10">
                    <div className="flex flex-col gap-2">
                        <Link href={`/p-admin/products/${comment.productId.slug}`} className="font-medium text-white underline text-sm xs:text-base md:text-lg lg:text-xl select-none">{comment?.productId.title}</Link>
                        <div className="flex flex-col items-start gap-2 text-xs md:text-sm lg:text-base text-nowrap">
                            <div className="flex items-center gap-1 flex-wrap select-none">
                                <h2 className="text-gray-400">status : </h2>
                                <span className={`${comment?.isApproved ? 'text-green-500' : 'text-red-500'} select-none text-xs md:text-sm lg:text-base`}>{comment.isApproved ? 'Approved' : 'Not Approved'}</span>
                            </div>
                            <div className="flex items-center gap-0.5 text-xs md:text-sm lg:text-base text-nowrap">
                                <h2 className="text-gray-400">username : </h2>
                                <Link href={`/p-admin/users/${comment.username}`} className="underline">{comment?.username}</Link>
                            </div>
                            <div className="flex items-center gap-0.5 text-xs md:text-sm lg:text-base text-nowrap">
                                <h2 className="text-gray-400">Rating : </h2>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className={`w-4 h-4 md:w-5 md:w-5 transition ${star <= comment.rating
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
                            <div className="flex items-center gap-0.5 text-xs md:text-sm lg:text-base text-nowrap">
                                <h2 className="text-gray-400">created At : </h2>
                                <span>{getMonth(comment?.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm md:text-lg text-white leading-relaxed select-none">
                        {comment?.commentText}
                    </p>
                    <div className="w-full flex flex-col xs:flex-row items-center gap-2 mt-10">
                        <div className="relative w-full">
                            <select
                                id="filterSelect"
                                className="p-4 w-full rounded-full text-white border border-[#1f1f1f] bg-[#0f0f0f] text-sm"
                                value={approval}
                                onChange={e => setApproval(e.target.value)}
                            >
                                <option value="approved">Approved</option>
                                <option value="notApproved">Not Approved</option>
                            </select>
                            <label
                                htmlFor='filterSelect'
                                className="absolute peer-focus:text-sky-500 transition-all -top-5 left-1/2 -translate-x-1/2  bg-black text-gray-500 text-nowrap text-xs"
                            >Comment Approval</label>
                        </div>
                        <button
                            className="p-3.5 h-full w-full rounded-3xl cursor-pointer bg-amber-500 disabled:bg-amber-300 hover:bg-amber-600 transition-colors text-black font-bold self-start text-nowrap text-sm md:mt-0 block"
                            onClick={updateComment}
                            disabled={isChangingApproval}
                        >{isChangingApproval ? 'changing Approval...' : 'change approval'}</button>
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

CommentDetails.noLayout = true

export default CommentDetails
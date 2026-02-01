import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

import AdminPanelSideBar from '@/components/modules/AdminPanelSideBar/AdminPanelSideBar';
import DeleteModal from '@/components/modules/deleteModal/DeleteModal'

import Users from '@/src/Models/User';
import Comments from '@/src/Models/Comment';
import { verifyRefreshToken } from '@/src/utils/auth';
import {autoFetch} from '@/utils/autoFetch';

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
        let comments = await Comments.find({}).populate('productId')

        if (user.role == 'USER') {
            return {
                redirect: { destination: '/p-user' }
            }
        }

        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                comments: JSON.parse(JSON.stringify(comments)),
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function AllComments({ user, comments }) {
    const [filteredComments, setFilteredComments] = useState(comments)
    const [search, setSearch] = useState('') // username
    const [filterType, setFilterType] = useState('username') // product slug username or approved or notApproved 
    const [changeIsPending, setChangeIsPending] = useState(false)
    const [getComments, setGetComments] = useState(false)
    const [isPending, setIsPending] = useState(null) // at first when it's just loaded the value is "null" but after that id it requires updating table it will be changed into "true" or "false"
    const getMonth = date => {
        if (!date) return ''
        let registerDate = new Date(date)

        let day = registerDate.getDate();
        let month = registerDate.getMonth() + 1;
        let year = registerDate.getFullYear();

        let hours = registerDate.getHours() < 10 ? `0${registerDate.getHours()}` : registerDate.getHours();
        let minute = registerDate.getMinutes() < 10 ? `0${registerDate.getMinutes()}` : registerDate.getMinutes();

        return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year} ${hours}:${minute}`
    }

    const changeCommentStatus = async (comment, approvedFlag) => {
        try {
            toastId = toast.loading(`${approvedFlag == 'approved' ? 'approving' : 'not approving'} comment`)
            let newComment = { isApproved: approvedFlag == 'approved' }
            setChangeIsPending(true)

            let res = await autoFetch(`/api/comments/${comment._id}`, {
                method: "PATCH",
                body: JSON.stringify(newComment)
            })

            // let resData = await res.json()
            // console.log(resData)

            if (res.status == 200) {
                setChangeIsPending(false)
                setIsPending(true)
                setGetComments(prev => !prev)
                toast.dismiss(toastId)
                toast.success(`comment ${approvedFlag} successfully`)
            }

        } catch (err) {
            setChangeIsPending(false)
            toast.dismiss(toastId)
            toast.error(err.message)
            console.log(err)
        }
    }

    const getCommentsHandler = async () => {
        try {
            let res = await autoFetch('/api/comments')

            let commentsData = await res.json()

            if (res.status == 200) {
                setFilteredComments(commentsData)
            }

        } catch (err) {
            console.log(err)
        } finally {
            setIsPending(false)
        }
    }


    useEffect(() => {
        switch (filterType) {
            case "username": {
                if (search.trim()) {
                    setFilteredComments(comments.filter(comment => comment.username.toLowerCase().includes(search.toLowerCase())))
                } else {
                    setFilteredComments(comments)
                }
                break;
            }
            case "productSlug": {
                if (search.trim()) {
                    setFilteredComments(comments.filter(comment => comment.productId.slug.toLowerCase().startsWith(search.toLowerCase())))
                } else {
                    setFilteredComments(comments)
                }
                break;
            }

            case 'approved': {
                setFilteredComments(comments.filter(comment => comment.isApproved));
                break;
            }

            case 'notApproved': {
                setFilteredComments(comments.filter(comment => !comment.isApproved));
                break;
            }

            default: {
                setFilteredComments(comments);
                break;
            }
        }
    }, [search, filterType])

    useEffect(() => {
        if (isPending != null) {
            setIsPending(true)
            getCommentsHandler()
        }
    }, [getComments])

    // console.log(comment)

    return (
        <div className="flex gap-5 min-h-screen pb-20 md:pb-10 xl:pb-0">
            <AdminPanelSideBar />
            <Head>
                <title>Coffee Uni | Comments</title>
            </Head>
            <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">

                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                        <span className="text-xs xs:text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Comments</span>
                </div>

                <div className="flex flex-col items-center justify-center gap-2">

                    <div className="flex flex-col-reverse md:flex-row items-center md:justify-between gap-9 md:gap-2 w-full border border-[#1f1f1f] p-4 pt-10 rounded-3xl bg-black">
                        <div className="w-full relative select-none">
                            <input
                                type="text"
                                className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                value={search}
                                onChange={e => setSearch(e.target.value.trim())}
                                placeholder={!['approved', 'notApproved'].includes(filterType) ? `Comment's ${filterType}...` : `${filterType} Comments`}
                                disabled={['approved', 'notApproved'].includes(filterType)}
                            />
                            <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0  px-2 bg-black text-gray-500">Search</span>
                        </div>
                        <div className="relative w-full md:w-1/3">
                            <select
                                id="filterSelect"
                                className="p-4 w-full rounded-full text-white border border-[#1f1f1f] bg-[#0f0f0f]"
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                            >
                                <option value="username">username</option>
                                <option value="productSlug">product slug</option>
                                <option value="approved">approved</option>
                                <option value="notApproved">not approved</option>
                            </select>
                            <label
                                htmlFor='filterSelect'
                                className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0  px-2 bg-black text-gray-500"
                            >Filter Type</label>
                        </div>
                    </div>
                    <div className="w-full min-h-[65vh] max-h-[65vh] py-3 px-2 rounded-3xl border border-[#1f1f1f] bg-black overflow-auto md:mb-20 lg:mb-10 xl:mb-0">

                        <table className="w-full">
                            <thead className="min-w-full">
                                <tr className="py-1 px-2">
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">index</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">product slug</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">username</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">rating</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">commentText</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">isApproved</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">createdAt</th>
                                    <th className="py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center pt-4">
                                {!isPending && filteredComments?.length > 0 && filteredComments.map((comment, index) => (
                                    <tr key={comment?._id} className="py-1 px-2 text-center text-gray-400  hover:text-white hover:bg-white/5 transition-colors select-none" >
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{index + 1}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{comment?.productId.slug}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{comment?.username}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{comment?.rating}</td>
                                        <td className="py-1 pb-3 px-2 text-sm min-w-52 max-w-52">{comment.commentText}</td>
                                        <td className={`text-nowrap py-1 pb-3 px-2 text-sm ${comment.isApproved ? 'text-green-500' : 'text-red-500'}`}>{comment?.isApproved ? 'true' : 'false'}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{getMonth(comment.createdAt)}</td>
                                        <td className="py-1 pb-3 px-2 text-sm flex items-center justify-center gap-4">
                                            <a
                                                href={`/p-admin/comments/${comment?._id}`}
                                                className="inline-flex items-center justify-center gap-1 p-1 lg:px-2 rounded-md cursor-pointer bg-sky-500/10 hover:bg-sky-500/25 transition-colors group"
                                            >
                                                <FaEye className="text-sky-500 group-hover:text-white transition-all" />
                                                <span className="text-sky-500 group-hover:text-white transition-colors ">details</span>
                                            </a>
                                            {!comment.isApproved ? (
                                                <button
                                                    className="inline-flex items-center justify-center gap-1 p-1 lg:px-2 rounded-md cursor-pointer border border-green-500 bg-green-500/10 disabled:bg-green/5 hover:bg-green-500/25 transition-colors group"
                                                    onClick={e => changeCommentStatus(comment, 'approved')}
                                                    disabled={changeIsPending}
                                                >
                                                    <FiCheck className="text-green-500 group-hover:text-white transition-all" />
                                                    <span className="text-green-500 group-hover:text-white transition-colors text-nowrap">{changeIsPending ? 'pending' : "Approve"}</span>
                                                </button>
                                            ) : (
                                                <button
                                                    className="inline-flex items-center justify-center gap-1 p-1 lg:px-2 rounded-md cursor-pointer border border-red-500 bg-red-500/10 disabled:bg-red-500/5 hover:bg-red-500/25 transition-colors group"
                                                    onClick={e => changeCommentStatus(comment, 'notApproved')}
                                                    disabled={changeIsPending}
                                                >
                                                    <RxCross1 className="text-red-500 group-hover:text-white transition-all" />
                                                    <span className="text-red-500 group-hover:text-white transition-colors text-nowrap">{changeIsPending ? 'pending' : "Not Approve"}</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!isPending && filteredComments?.length == 0 && (
                            <div className="text-center text-white my-auto mt-36">there is no Comment {['username', 'productSlug'].includes(filterType) ? `with "${search}" ${filterType}` : `which is "${filterType == 'approved' ? 'Approved' : 'Not Approved'}"`} </div>
                        )}

                        {isPending && (
                            <div className="text-center text-white my-auto mt-36">loading new Comments data ...</div>
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

AllComments.noLayout = true

export default AllComments
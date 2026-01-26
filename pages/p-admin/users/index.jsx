import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import toast from 'react-hot-toast';
import Link from 'next/link';

import AdminPanelSideBar from '@/components/modules/AdminPanelSideBar/AdminPanelSideBar';

import Users from '@/src/Models/User'
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
        let users = await Users.find({})

        if (user.role == 'USER') {
            return {
                redirect: { destination: '/p-user' }
            }
        }

        return {
            props: {
                mainUser: JSON.parse(JSON.stringify(user)),
                users: JSON.parse(JSON.stringify(users)),
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function AllUsers({ mainUser, users }) {
    const [filteredUsers, setFilteredUsers] = useState(users)
    const [search, setSearch] = useState('') // username or email
    const [activeSearchType, setActiveSearchType] = useState('username') // username or email
    // let { user } = useAuth()

    const errorNotify = text => {
        toast.error(text)
    }

    let router = useRouter()

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

    useEffect(() => {
        if (search.trim()) {
            if (activeSearchType == 'username') {
                setFilteredUsers(users.filter(user => user.username.includes(search)))
            } else {
                setFilteredUsers(users.filter(user => user.email.includes(search)))
            }
        } else {
            setFilteredUsers(users)
        }
    }, [search, activeSearchType])

    useEffect(() => {
        console.log(router)
    }, [])

    return (
        <div className="flex gap-5 min-h-screen pb-20 md:pb-10 lg:pb-0">
            <AdminPanelSideBar />
            <Head>
                <title>Coffee Uni | Users</title>
            </Head>
            <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">

                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                        <span className="text-xs xs:text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Users</span>
                </div>

                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex flex-col-reverse md:flex-row items-center md:justify-between gap-5 md:gap-2 w-full border border-[#1f1f1f] p-4 md:pt-10 rounded-3xl bg-black">
                        <div className="w-full relative select-none">
                            <input
                                type="text"
                                className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                placeholder={` user's ${activeSearchType}...`}
                                value={search}
                                onChange={e => setSearch(e.target.value.trim())}
                            />
                            <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0  px-2 bg-black text-gray-500">Search</span>
                        </div>

                        <div className="flex items-center justify-center gap-1 p-1 rounded-full border border-[#1f1f1f] bg-[#0f0f0f]">
                            <div className="">
                                <input
                                    type="radio"
                                    id="usernameRadioBtn"
                                    name="searchType"
                                    data-checkValue="username"
                                    className="hidden peer"
                                    checked={activeSearchType == 'username'}
                                    onChange={e => setActiveSearchType(e.target.dataset.checkvalue)}
                                />
                                <label htmlFor="usernameRadioBtn" className="p-2 inline-block text-white w-fit h-full rounded-full cursor-pointer peer-checked:bg-amber-500 peer-checked:text-white font-bold transition-colors text-sm select-none">UserName</label>
                            </div>

                            <div className="">
                                <input
                                    type="radio"
                                    id="emailRadioBtn"
                                    name="searchType"
                                    data-checkValue="email"
                                    className="hidden peer"
                                    checked={activeSearchType == 'email'}
                                    onChange={e => setActiveSearchType(e.target.dataset.checkvalue)}
                                />
                                <label htmlFor="emailRadioBtn" className="p-2 inline-block text-white w-fit h-full rounded-full cursor-pointer peer-checked:bg-amber-500 peer-checked:text-white font-bold transition-colors text-sm select-none">Email</label>
                            </div>
                        </div>

                    </div>

                    <div className="w-full min-h-[65vh] max-h-[65vh] py-3 px-2 rounded-3xl border border-[#1f1f1f] bg-black overflow-auto">
                        <table className="w-full">
                            <thead className="min-w-full">
                                <tr className="py-1 px-2">
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">index</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">fullName</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">userName</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">Email</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">createdAt</th>
                                    <th className="py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center pt-4">
                                {filteredUsers?.length > 0 && filteredUsers.map((user, index) => mainUser._id != user._id && (
                                    <tr key={user?.id} className="py-1 px-2 text-center text-gray-400  hover:text-white hover:bg-white/5 transition-colors select-none" >
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{index + 1}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{user?.firstname} {user?.lastname}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{user?.username}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{user?.email}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{getMonth(user?.createdAt)}</td>
                                        <td className="py-1 pb-3 px-2 text-sm flex items-center justify-center gap-1">
                                            {/* <a
                                                href={`/my-account/adminPanel/user?s/edit-user?/${user?.id}`}
                                                className="inline-block p-1 rounded-md cursor-pointer bg-sky-200 hover:bg-sky-500 transition-colors group"
                                            >
                                                <MdEdit className="text-sky-500 group-hover:text-white transition-all" />
                                            </a> */}

                                            <a
                                                href={`/p-admin/users/${user?.username}`}
                                                className="inline-flex items-center gap-1 p-1 lg:px-2 rounded-md cursor-pointer bg-green-500/10 hover:bg-green-500/25 transition-colors group"
                                            >
                                                <FaEye className="text-green-500 group-hover:text-white transition-all" />
                                                <span className="text-green-500 group-hover:text-white transition-colors ">details</span>
                                            </a>

                                            {/* <button
                                                className="p-1 rounded-md cursor-pointer bg-red-200 hover:bg-red-500 transition-colors group"
                                            >
                                                <FaBan className="text-red-500 group-hover:text-white transition-all" />
                                            </button> */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers?.length == 0 && (
                            <div className="text-center text-white my-auto">there is no user with "{search}" {activeSearchType}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

AllUsers.noLayout = true

export default AllUsers
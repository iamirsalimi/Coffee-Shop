import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

import AdminPanelSideBar from '@/components/modules/AdminPanelSideBar/AdminPanelSideBar';

import Users from '@/src/Models/User';
import Contacts from '@/src/Models/Contact';
import { verifyRefreshToken } from '@/src/utils/auth';

import { MdKeyboardArrowLeft } from "react-icons/md";
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
        let contacts = await Contacts.find({})

        if (user.role == 'USER') {
            return {
                redirect: { destination: '/p-user' }
            }
        }

        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                contacts: JSON.parse(JSON.stringify(contacts)),
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function AllContacts({ user, contacts }) {
    const [filteredContacts, setFilteredContacts] = useState(contacts)
    const [search, setSearch] = useState('') // name or email
    const [filterType, setFilterType] = useState('name') // name or email

    const getMonth = date => {
        if (!date) return ''
        let registerDate = new Date(date)

        let day = registerDate.getDate();
        let month = registerDate.getMonth() + 1;
        let year = registerDate.getFullYear();

        return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`
    }

    useEffect(() => {
        if (search.trim()) {
            setFilteredContacts(contacts.filter(contact => contact[filterType].toLowerCase().includes(search.toLowerCase())))
        } else {
            setFilteredContacts(contacts)
        }
    }, [search, filterType])

    // console.log(Contacts)

    return (
        <div className="flex gap-5 min-h-screen pb-20 md:pb-10 xl:pb-0">
            <AdminPanelSideBar />
            <Head>
                <title>Coffee Uni | Contacts</title>
            </Head>
            <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">

                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                        <span className="text-xs xs:text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Contacts</span>
                </div>

                <div className="flex flex-col items-center justify-center gap-2">

                    <div className="flex flex-col-reverse md:flex-row items-center md:justify-between gap-9 md:gap-2 w-full border border-[#1f1f1f] p-4 pt-10 rounded-3xl bg-black">
                        <div className="w-full relative select-none">
                            <input
                                type="text"
                                className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                value={search}
                                onChange={e => setSearch(e.target.value.trim())}
                                placeholder={`contact's ${filterType}...`}
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
                                <option value="name">name</option>
                                <option value="email">email</option>
                            </select>
                            <label
                                htmlFor='filterSelect'
                                className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0  px-2 bg-black text-gray-500"
                            >Filter Type</label>
                        </div>
                    </div>
                    <div className="w-full min-h-[65vh] max-h-[65vh] py-3 px-2 rounded-3xl border border-[#1f1f1f] bg-black overflow-auto mb-20">

                        <table className="w-full">
                            <thead className="min-w-full">
                                <tr className="py-1 px-2">
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">index</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">name</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">email</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">message</th>
                                    <th className="text-nowrap py-1 pb-3 px-2 text-sm text-light-gray dark:text-gray-400">createdAt</th>
                                </tr>
                            </thead>
                            <tbody className="text-center pt-4">
                                {filteredContacts?.length > 0 && filteredContacts.map((contact, index) => (
                                    <tr key={contact?._id} className="py-1 px-2 text-center text-gray-400  hover:text-white hover:bg-white/5 transition-colors select-none" >
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{index + 1}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{contact?.name}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{contact?.email}</td>
                                        <td className="py-1 pb-3 px-2 text-sm min-w-52 max-w-52">{contact.message}</td>
                                        <td className="text-nowrap py-1 pb-3 px-2 text-sm">{getMonth(contact.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredContacts?.length == 0 && (
                            <div className="text-center text-white my-auto mt-36">there is no contact with {`"${search}" ${filterType}`}</div>
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

AllContacts.noLayout = true

export default AllContacts
import React, { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import toast from 'react-hot-toast';

import { useAuth } from '@/Context/AuthContext';

import PanelSideBar from '@/components/modules/PanelSideBar/PanelSideBar';

import { PiEyeBold } from "react-icons/pi";
import { PiEyeClosedBold } from "react-icons/pi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Link from 'next/link';

let usernameRegex = /^[0-9A-Za-z_.]+$/
let passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#@_.])(?!.* ).{8,16}$/


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

function ProfileEdit() {
    const [showCurrentPass, setShowCurrentPass] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [showRepeatPass, setRepeatShowPass] = useState(false)

    let { user } = useAuth()

    const schema = yup.object().shape({
        firstname: yup.string().required('firstname is mandatory'),
        lastname: yup.string().required('last name is mandatory'),
        email: yup.string().email('email is invalid').required('email is mandatory'),
        username: yup
            .string()
            .required('username is mandatory')
            .min(5, 'username must have 5 character at least')
            .matches(usernameRegex, 'username is invalid')
        ,
        recentPassword: yup
            .string()
            .min(8, 'Password must have at least 8 characters')
            .max(16, 'Password can have maximum 16 characters')
            .matches(passwordRegex, 'password is invalid , please check the guideline')
            .notRequired,
        newPassword: yup.string().notRequired(),
        confirmNewPassword: yup.string().notRequired(),
    })

    let {
        register,
        handleSubmit,
        setValue,
        watch,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    let recentPassword = watch('recentPassword')
    let newPassword = watch('newPassword')
    let confirmNewPassword = watch('confirmNewPassword')

    const errorNotify = text => {
        toast.error(text)
    }

    // yup can't validate matching two password inputs and also recognize them as a not required fields 
    const validatePasswords = (recentPassword, newPassword, confirmNewPassword) => {
        if (newPassword && !passwordRegex.test(newPassword)) {
            setError('newPassword', { type: 'validation', message: 'password is invalid' });
        }

        if (confirmNewPassword && !passwordRegex.test(confirmNewPassword)) {
            setError('confirmNewPassword', { type: 'validation', message: 'password is invalid' });
        }

        if (newPassword != confirmNewPassword) {
            setError('confirmNewPassword', { type: 'match', message: 'new password and new password repeat are not equal' });
            setError('newPassword', { type: 'match', message: 'new password and new password repeat are not equal' });
            return;
        }

        if (newPassword === recentPassword) {
            setError('newPassword', { type: 'same', message: "new password can't be same as current password" });
            setError('confirmNewPassword', { type: 'same', message: "new password can't be same as current password" });
            return;
        }
    }

    const updateUserHandler = async (data) => {
        validatePasswords(data.recentPassword, data.newPassword, data.confirmNewPassword)

        if (Object.keys(errors).length == 0) {
            if (user?.firstname != data.firstname || user?.lastname != data.lastname || user?.username != data.username || user?.email != data.email || user?.password != data.newPassword) {
                let newUser = { ...user }

                newUser.firstname = data.firstname
                newUser.lastname = data.lastname
                newUser.nickName = data.nickName
                newUser.username = data.username
                newUser.email = data.email

                if (data.newPassword) {
                    newUser.password = data.newPassword
                }

                console.log(newUser)
                // await updateUser(newUser.id, newUser)
            }
        }
    }

    const toggleShowingPassHandler = (setShowPass) => {
        setShowPass(prev => !prev)
    }

    useEffect(() => {
        if (user) {
            setValue('firstname', user?.firstname, { shouldValidate: true })
            setValue('lastname', user?.lastname, { shouldValidate: true })
            setValue('username', user?.username, { shouldValidate: true })
            setValue('email', user?.email, { shouldValidate: true })
        }
    }, [user])

    useEffect(() => {
        if (newPassword || confirmNewPassword) {
            validatePasswords(recentPassword, newPassword, confirmNewPassword)
        }
    }, [recentPassword, newPassword, confirmNewPassword])

    return (
        <div className="flex gap-5 min-h-screen pb-20 md:pb-10 lg:pb-0">
            <PanelSideBar />
            <form className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]" onSubmit={handleSubmit(updateUserHandler)}>

                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                        <span className="text-xs xs:text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Profile Edit</span>
                </div>

                {/* Update Profile guideLines */}
                <ul className="flex flex-col gap-2 text-sm p-5 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 list-disc pl-5">
                    <li>
                        username mist be between 5 to 18 characters
                    </li>
                    <li>
                        password must at least be 8 characters and contains 1 character (#or@or.) , 1 number  , 1 uppercase letter , and 1 lowercase letter
                    </li>
                    <li>
                        Constructive criticism is always welcome and helps us improve.
                    </li>
                    <li>
                        For detailed issues or direct communication, please use the Contact page.
                    </li>
                </ul>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* First Name */}
                    <div className="w-full relative select-none">
                        <input
                            type="text"
                            className="w-full rounded-md p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                            {...register('firstname')}
                        />
                        <span className="absolute peer-focus:text-sky-500 transition-all -top-3 left-2  px-2 bg-[#0f0f0f] text-gray-500">firstName</span>
                    </div>

                    {/* last Name */}
                    <div className="w-full relative select-none">
                        <input
                            type="text"
                            className="w-full rounded-md p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                            {...register('lastname')}

                        />
                        <span className="absolute peer-focus:text-sky-500 transition-all -top-3 left-2  px-2 bg-[#0f0f0f] text-gray-500">lastName</span>
                    </div>

                    {/* username */}
                    <div className="w-full relative select-none">
                        <input
                            type="text"
                            className="w-full rounded-md p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                            {...register('username')}
                        />
                        <span className="absolute peer-focus:text-sky-500 transition-all -top-3 left-2  px-2 bg-[#0f0f0f] text-gray-500">userName</span>
                        {errors.username && (
                            <span className="text-sm text-red-500 ">{errors.username.message}</span>
                        )}
                    </div>

                    {/* Email */}

                    <div className="w-full relative select-none">
                        <input
                            type="text"
                            className="w-full rounded-md p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                            {...register('email')}
                        />
                        <span className="absolute peer-focus:text-sky-500 transition-all -top-3 left-2  px-2 bg-[#0f0f0f] text-gray-500">Email</span>
                        {errors.email && (
                            <span className="text-sm text-red-500 ">{errors.email.message}</span>
                        )}
                    </div>

                </div>

                <div className="grid grid-cols-3 gap-5">
                    <h2 className="col-start-1 col-end-4  text-gray-800 dark:text-white text-lg">Change Password</h2>
                    {/* Current Password */}

                    <div className="col-start-1 col-end-4 lg:col-start-1 lg:col-end-2 w-full flex flex-col gap-1">
                        <div className="col-start-1 col-end-4 lg:col-start-1 lg:col-end-2 w-full relative select-none">
                            <input
                                type={`${showCurrentPass ? 'text' : 'password'}`}
                                className="w-full rounded-md p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors" minLength={8} maxLength={16}
                                {...register('recentPassword')}

                            />
                            <span className="absolute peer-focus:text-sky-500 transition-all -top-3 left-2  px-2 bg-[#0f0f0f] text-gray-500">Current Password</span>
                            <div onClick={() => toggleShowingPassHandler(setShowCurrentPass)} className="absolute right-6 bottom-1/2 translate-1/2 cursor-pointer select-none text-light-gray dark:text-gray-500 transition-all peer-focus:!text-sky-500">
                                {showCurrentPass ? (
                                    <PiEyeClosedBold className="text-2xl" />
                                ) : (
                                    <PiEyeBold className="text-2xl" />
                                )}
                            </div>
                        </div>
                        {errors.recentPassword && (
                            <span className="text-sm text-red-500 ">{errors.recentPassword.message}</span>
                        )}
                    </div>


                    {/* New Password */}
                    <div className="col-start-1 col-end-4 lg:col-start-2 lg:col-end-3 w-full flex flex-col gap-1">
                        <div className="relative select-none">
                            <input
                                type={`${showPass ? 'text' : 'password'}`}
                                className="w-full rounded-md p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors" minLength={8} maxLength={16}
                                {...register('newPassword')}
                            />
                            <span className="absolute peer-focus:text-sky-500 transition-all -top-3 left-2  px-2 bg-[#0f0f0f] text-gray-500">New Password</span>
                            <div onClick={() => toggleShowingPassHandler(setShowPass)} className="absolute right-6 bottom-1/2 translate-1/2 cursor-pointer select-none text-light-gray dark:text-gray-500 transition-all peer-focus:!text-sky-500">
                                {showPass ? (
                                    <PiEyeClosedBold className="text-2xl" />
                                ) : (
                                    <PiEyeBold className="text-2xl" />
                                )}
                            </div>
                        </div>
                        {errors.newPassword && (
                            <span className="text-sm text-red-500 ">{errors.newPassword.message}</span>
                        )}
                    </div>

                    {/* Repeat New Password */}

                    <div className="col-start-1 col-end-4 lg:col-start-3 lg:col-end-4 w-full flex flex-col gap-1">
                        <div className="relative select-none">
                            <input
                                type={`${showRepeatPass ? 'text' : 'password'}`}
                                className="w-full rounded-md p-3 border border-[#1f1f1f] bg-[#0f0f0f] outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors" minLength={8} maxLength={16}
                                {...register('confirmNewPassword')}
                            />
                            <span className="absolute peer-focus:text-sky-500 transition-all -top-3 left-2  px-2 bg-[#0f0f0f] text-gray-500">New Password Repeat</span>
                            <div onClick={() => toggleShowingPassHandler(setRepeatShowPass)} className="absolute right-6 bottom-1/2 translate-1/2 cursor-pointer select-none text-light-gray dark:text-gray-500 transition-all peer-focus:!text-sky-500">
                                {showRepeatPass ? (
                                    <PiEyeClosedBold className="text-2xl" />
                                ) : (
                                    <PiEyeBold className="text-2xl" />
                                )}
                            </div>
                        </div>
                        {errors.confirmNewPassword && (
                            <span className="text-sm text-red-500 ">{errors.confirmNewPassword.message}</span>
                        )}
                    </div>

                </div>
                <button className="py-2 rounded-lg bg-sky-500 hover:bg-sky-600 font-semibold transition-colors text-white  cursor-pointer">Edit Profile</button>
            </form>
        </div>
    )
}

ProfileEdit.noLayout = true

export default ProfileEdit
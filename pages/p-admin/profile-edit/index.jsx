import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

import AdminPanelSideBar from '@/components/modules/AdminPanelSideBar/AdminPanelSideBar';

import Users from '@/src/Models/User'
import { verifyRefreshToken } from '@/src/utils/auth';
import { useAuth } from '@/Context/AuthContext';
import { autoFetch } from '@/utils/autoFetch';

import { PiEyeBold } from "react-icons/pi";
import { PiEyeClosedBold } from "react-icons/pi";
import { MdKeyboardArrowLeft } from "react-icons/md";

let usernameRegex = /^[0-9A-Za-z_.]+$/
let passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#@_.])(?!.* ).{8,16}$/

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
        // console.log(user, user.role)

        if (user.role == 'USER') {
            return {
                redirect: { destination: '/p-user' }
            }
        }

        return {
            props: {
                user: JSON.parse(JSON.stringify(user))
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

function ProfileEdit({ user }) {
    const [showCurrentPass, setShowCurrentPass] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [showRepeatPass, setRepeatShowPass] = useState(false)
    const [isPending, setIsPending] = useState(false)

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
            .trim()
            .notRequired(),

        newPassword: yup
            .string()
            .trim()
            .when("recentPassword", {
                is: (val) => val.trim(), // change it to boolean 
                then: (schema) =>
                    schema
                        .required("New password is required")
                        .min(8, "Password must have at least 8 characters")
                        .max(16, "Password can have maximum 16 characters")
                        .matches(
                            passwordRegex,
                            "password is invalid , please check the guideline"
                        ),
                otherwise: (schema) => schema.notRequired(),
            }),

        confirmNewPassword: yup
            .string()
            .trim()
            .notRequired(),
    })

    let {
        register,
        handleSubmit,
        setValue,
        watch,
        setError,
        formState: { errors },
    } = useForm({
        default: {
            recentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
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

        if (recentPassword.trim()) {

            if (newPassword === recentPassword) {
                setError('newPassword', { type: 'same', message: "new password can't be same as current password" });
                setError('confirmNewPassword', { type: 'same', message: "new password can't be same as current password" });
                return;
            }
        }
    }

    const updateUserHandler = async (data) => {
        validatePasswords(data.recentPassword || '', data.newPassword, data.confirmNewPassword)

        if (Object.keys(errors).length == 0) {
            if (user?.firstname != data.firstname || user?.lastname != data.lastname || user?.username != data.username || user?.email != data.email || user?.password != data.newPassword) {
                let newUser = {}

                newUser.firstname = data.firstname
                newUser.lastname = data.lastname
                newUser.username = data.username
                newUser.email = data.email
                newUser.oldPassword = user.password

                console.log(newUser)

                if (data.newPassword) {
                    newUser.oldPassword = data.recentPassword
                    newUser.newPassword = data.newPassword
                } else {
                    newUser.newPassword = -1
                }

                // console.log(newUser)
                try {
                    setIsPending(true)
                    toastId = toast.loading('updating your account information')

                    let res = await autoFetch(`/api/user/profile/${user._id}`, {
                        method: "PATCH",
                        body: JSON.stringify(newUser)
                    })

                    let resData = await res.json();

                    if ([422, 404].includes(res.status)) {
                        toast.dismiss(toastId)
                        toast.error(resData.message)
                    }

                    if (res.status == 200) {
                        toast.dismiss(toastId)
                        toast.success('your information updated successfully')
                        location.reload()
                    }
                } catch (err) {
                    toast.dismiss(toastId)
                    toast.error(err.message)
                    console.log(err)
                } finally {
                    setIsPending(false)
                }
            }
        }
    }

    const toggleShowingPassHandler = (setShowPass) => {
        setShowPass(prev => !prev)
    }

    useEffect(() => {
        if (user) {
            setValue('firstname', user?.firstname)
            setValue('lastname', user?.lastname)
            setValue('username', user?.username)
            setValue('email', user?.email)
        }
    }, [user])

    useEffect(() => {
        if (newPassword || confirmNewPassword) {
            validatePasswords(recentPassword, newPassword, confirmNewPassword)
        }
    }, [recentPassword, newPassword, confirmNewPassword])

    return (
        <div className="flex gap-5 min-h-screen pb-28 lg:pb-10 xl:pb-0 bg-[#0f0f0f]">
            <AdminPanelSideBar />
            <Head>
                <title>Coffee Uni | Profile Edit</title>
            </Head>
            <form className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7" onSubmit={handleSubmit(updateUserHandler)}>

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
                        username must be between 5 to 18 characters
                    </li>
                    <li>
                        password must at least be 8 characters and contains 1 character (#or@or.) , 1 number  , 1 uppercase letter , and 1 lowercase letter
                    </li>
                    <li>
                        Your new password must be different from your current password.
                    </li>
                </ul>

                <div className="flex flex-col gap-7 bg-black border border-[#1f1f1f] rounded-3xl p-4 pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-12">
                        {/* First Name */}
                        <div className="w-full relative select-none">
                            <input
                                type="text"
                                className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                {...register('firstname')}
                            />
                            <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">firstName</span>
                        </div>

                        {/* last Name */}
                        <div className="w-full relative select-none">
                            <input
                                type="text"
                                className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                {...register('lastname')}

                            />
                            <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">lastName</span>
                        </div>

                        {/* username */}
                        <div className="w-full relative select-none">
                            <input
                                type="text"
                                className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                {...register('username')}
                            />
                            <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">userName</span>
                            {errors.username && (
                                <span className="text-sm text-red-500 ">{errors.username.message}</span>
                            )}
                        </div>

                        {/* Email */}

                        <div className="w-full relative select-none">
                            <input
                                type="text"
                                className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                {...register('email')}
                            />
                            <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">Email</span>
                            {errors.email && (
                                <span className="text-sm text-red-500 ">{errors.email.message}</span>
                            )}
                        </div>

                    </div>

                    <div className="grid grid-cols-3 gap-5 gap-y-16">
                        <h2 className="col-start-1 col-end-4  text-gray-800 dark:text-white text-lg mb-5">Change Password</h2>
                        {/* Current Password */}

                        <div className="col-start-1 col-end-4 lg:col-start-1 lg:col-end-2 w-full flex flex-col gap-1">
                            <div className="col-start-1 col-end-4 lg:col-start-1 lg:col-end-2 w-full relative select-none">
                                <input
                                    type={`${showCurrentPass ? 'text' : 'password'}`}
                                    className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base" minLength={8} maxLength={16}
                                    {...register('recentPassword')}

                                />
                                <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">Current Password</span>
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
                                    className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base" minLength={8} maxLength={16}
                                    {...register('newPassword')}
                                />
                                <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">New Password</span>
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
                                    className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base" minLength={8} maxLength={16}
                                    {...register('confirmNewPassword')}
                                />
                                <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">New Password Repeat</span>
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
                    <button
                        className="py-2 rounded-2xl bg-amber-500 disabled:bg-amber-300 hover:bg-amber-600 font-semibold transition-colors text-black  cursor-pointer"
                        disabled={isPending}
                    >{isPending ? 'Editing Profile' : 'Edit Profile'}</button>
                </div>
            </form>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </div>
    )
}

ProfileEdit.noLayout = true

export default ProfileEdit
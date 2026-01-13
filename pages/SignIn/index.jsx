import React, { useState } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

import { PiEyeBold } from "react-icons/pi";
import { PiEyeClosedBold } from "react-icons/pi";
import { GrFormPrevious } from "react-icons/gr";
import { useRouter } from 'next/router';
import { useAuth } from '@/Context/AuthContext';

function SignIn() {
    const [showPass, setShowPass] = useState(false)

    let { setGetData } = useAuth()

    const loginSchema = yup.object().shape({
        identifier: yup
            .string()
            .min(5, "UserName must be at least 5 characters")
            .required("this field is required"),

        password: yup
            .string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),

    });

    let {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema)
    })

    const router = useRouter()

    const loginUser = async data => {
        let userObj = { ...data, username: toLowerCase(data.username) }

        let res = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userObj)
        })


        let resData = await res.json()
        console.log(res, resData)

        if ([422, 500].includes(res.status)) {
            errorNotify(resData.message)
            console.log(resData)
        } else {
            toast.success('You Logged in Successfully')
            setGetData(prev => !prev)
            localStorage.setItem('accessToken', resData.accessToken)
            router.replace('/')
        }
    }

    const errorNotify = text => {
        toast.error(text)
    }

    const toggleShowingPassHandler = () => {
        setShowPass(prev => !prev)
    }

    return (
        <div className="w-9/10 sm:w-4/5 md:w-1/2 lg:w-1/3 mx-auto flex flex-col items-start justify-center gap-5 py-5 pt-5">
            <Link href="/" className="inline-flex items-center justify-center gap-2 w-fit px-2 py-1.5 rounded-md cursor-pointer bg-black" >
                <GrFormPrevious className="text-sm text-white" />
                <span className="text-sm text-white">Return to home</span>
            </Link>
            <div className="w-full bg-[#171717] px-4 rounded-xl mx-auto flex flex-col gap-5 p-5">

                <h2 className="text-2xl text-white">Log in to Coffee Uni</h2>

                <form className="w-full flex flex-col justify-center items-center lg:items-start gap-7" onSubmit={(handleSubmit(loginUser))}>
                    <div className="w-full relative select-none">
                        <input
                            type="text"
                            className="w-full rounded-md p-3 border border-gray-600 bg-[#171717] outline-none text-white peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                            {...register('identifier')}
                        />
                        <span className="absolute peer-focus:text-sky-500 transition-all -top-3 left-2 px-2 text-gray-600 bg-[#171717]">userName</span>
                        {errors?.identifier && (
                            <span className="text-sm text-red-500 -mt-5">{errors.identifier.message}</span>
                        )}
                    </div>

                    <div className="w-full relative select-none">
                        <div className="w-full relative">
                            <input
                                type={`${showPass ? 'text' : 'password'}`}
                                className="w-full rounded-md p-3 border border-gray-600 text-white focus:text-sky-500 outline-none peer focus:border-sky-500 transition-colors pr-5"
                                {...register('password')}
                            />
                            <span className="absolute peer-focus:text-sky-500 transition-all -top-3 left-2 px-2 dark:text-gray-600 bg-[#171717] dark:bg-primary">password</span>
                            <div onClick={toggleShowingPassHandler} className="absolute right-5 bottom-1/2 translate-1/2 cursor-pointer select-none dark:text-gray-600 transition-all peer-focus:text-sky-500">
                                {showPass ? (
                                    <PiEyeClosedBold className="text-2xl" />
                                ) : (
                                    <PiEyeBold className="text-2xl" />
                                )}
                            </div>
                        </div>
                        {errors?.password && (
                            <span className="text-sm text-red-500 -mt-5">{errors.password.message}</span>
                        )}

                    </div>

                    <button className="w-full py-4 rounded-md cursor-pointer bg-sky-500 hover:bg-sky-600 transition-colors text-white font-bold disabled:!bg-sky-300">
                        sign in
                    </button>
                    <div className="w-full flex items-center justify-between -mt-4">
                        <Link href="/SignUp" className="w-fit text-sm px-2 py-1 rounded-md cursor-pointer font-light bg-gray-200 dark:bg-black text-gray-500 dark:text-white">Register</Link>
                        <Link href="#" className="w-fit text-sm px-2 py-1 rounded-md cursor-pointer font-light bg-gray-200 dark:bg-black text-gray-500 dark:text-white">Forgot Your Password ?</Link>
                    </div>
                </form>
            </div>

            <Toaster
                position="top-left"
                reverseOrder={false}
            />
        </div>
    )
}

SignIn.noLayout = true

export default SignIn

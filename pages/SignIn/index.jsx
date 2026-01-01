import React, { useState } from 'react'

import { PiEyeBold } from "react-icons/pi";
import { PiEyeClosedBold } from "react-icons/pi";
import { IoIosArrowForward } from "react-icons/io";

function SignIn() {
    const [showPass, setShowPass] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const toggleShowingPassHandler = () => {
        setShowPass(prev => !prev)
    }

    return (
        <div className="w-9/10 sm:w-4/5 md:w-1/2 lg:w-1/3 mx-auto flex flex-col items-start justify-center gap-5 py-5 pt-20">
            <a href="/" className="inline-flex items-center justify-center gap-2 w-fit px-2 py-1.5 rounded-md cursor-pointer bg-gray-800" >
                <span className="text-sm font-vazir text-gray-500 dark:text-white">Return to home</span>
                <IoIosArrowForward className="text-sm text-gray-500 dark:text-white" />
            </a>
            <div className="w-full bg-white px-4 rounded-xl mx-auto flex flex-col gap-5 p-5">

                <h2 className="font-vazir text-2xl text-gray-700">Log in to Coffee Uni</h2>

                <form action="" className="w-full flex flex-col justify-center items-center lg:items-start gap-7">
                    <div className="w-full relative select-none">
                        <input
                            type="text"
                            className="w-full rounded-md p-3 border border-gray-600 bg-white outline-none text-gray-600 peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                        />
                        <span className="absolute peer-focus:text-sky-500 transition-all -top-3 left-2 px-2 dark:text-gray-600 bg-white dark:bg-primary">userName</span>
                    </div>

                    <div className="w-full relative select-none">
                        <input
                            type={`${showPass ? 'text' : 'password'}`}
                            className="w-full rounded-md p-3 border border-gray-600 text-gray-600 focus:text-sky-500 outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors pr-5" minLength={8} maxLength={16}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <span className="absolute peer-focus:text-sky-500 transition-all -top-3 left-2 px-2 dark:text-gray-600 bg-white dark:bg-primary">password</span>
                        <div onClick={toggleShowingPassHandler} className="absolute right-5 bottom-1/2 translate-1/2 cursor-pointer select-none dark:text-gray-600 transition-all peer-focus:!text-sky-500">
                            {showPass ? (
                                <PiEyeClosedBold className="text-2xl" />
                            ) : (
                                <PiEyeBold className="text-2xl" />
                            )}
                        </div>

                    </div>
                    {/* {errors.password && (
                    <span className="text-sm font-vazir text-red-500 -mt-5">{errors.password}</span>
                )} */}

                    <div className="w-full">
                        <input id="default-checkbox" type="checkbox" value="" className="peer" hidden checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                        <label htmlFor="default-checkbox" className="flex items-center w-fit">
                            <span className={`inline-block cursor-pointer w-5 h-5 rounded-md border transition-colors ${rememberMe ? '!border-sky-500 bg-sky-500' : 'border-light-gray dark:border-gray-600'} `}></span>
                            <span className="ms-2 text-sm font-vazir dark:text-gray-600 select-none">Remember Me</span>
                        </label>
                    </div>

                    <button className="w-full py-4 rounded-md cursor-pointer bg-sky-500 hover:bg-sky-600 transition-colors font-vazir text-white font-bold disabled:!bg-sky-300">
                        sign in
                    </button>
                    <div className="w-full flex items-center justify-between -mt-4">
                        <a href="/account/register" className="w-fit text-sm px-2 py-1 rounded-md cursor-pointer font-vazir font-light bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-white">Register</a>
                        <a href="#" className="w-fit text-sm px-2 py-1 rounded-md cursor-pointer font-vazir font-light bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-white">Forgot Your Password ?</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

SignIn.noLayout = true

export default SignIn

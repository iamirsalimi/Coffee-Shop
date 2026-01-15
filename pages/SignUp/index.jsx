import React, { useState } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import * as yup from 'yup'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast, { Toaster } from 'react-hot-toast';

import { PiEyeBold } from "react-icons/pi";
import { PiEyeClosedBold } from "react-icons/pi";
import { FaCircleInfo } from "react-icons/fa6";
import { GrFormPrevious } from "react-icons/gr";
import { useAuth } from '@/Context/AuthContext';

let userNameRegex = /^[0-9A-Za-z_.]+$/
let passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#@_.])(?!.* ).{8,16}$/

function SignUp() {
  const registerSchema = yup.object().shape({
    firstname: yup
      .string()
      .min(2, "FirstName must be at least 2 characters")
      .required("FirstName is required"),

    lastname: yup
      .string()
      .min(2, "LastName must be at least 2 characters")
      .required("LastName is required"),

    username: yup
      .string()
      .min(5, "UserName must be at least 5 characters")
      .matches(userNameRegex, "Username is invalid !!")
      .required("UserName is required"),

    email: yup
      .string()
      .email("Invalid email")
      .required("Email is required"),

    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(passwordRegex, "Password must at least contain 1 character(_or.or#or@) , 1 Number , 1 UpperCase and 1 LowerCase ")
      .required("Password is required"),

    repeatPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match")
      .required("Confirm your password"),
  });

  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema)
  })

  let { setGetData } = useAuth()

  const router = useRouter()

  const registerUser = async data => {
    let newUser = {
      firstname: data.firstname,
      lastname: data.lastname,
      username: data.username.toLowerCase(),
      email: data.email,
      password: data.password,
    }

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })

    let resData = await res.json()
    console.log(resData)

    if (res.status == 422 || res.status == 500) {
      errorNotify(resData.message)
    } else {
      // user created successfully so we have to store accessToken and redirect user to home page
      toast.success('Your Account Created Successfully')
      localStorage.setItem('accessToken', resData.accessToken)
      setGetData(prev => !prev)
      router.replace('/')
    }
  }

  const [showPass, setShowPass] = useState(false)
  const [repeatShowPass, setRepeatShowPass] = useState(false)

  const errorNotify = text => {
    toast.error(text)
  }

  return (
    <div className="w-9/10 sm:w-4/5 md:w-1/2 lg:w-1/3 mx-auto flex flex-col items-start justify-center gap-5 py-5 pt-5">
      <div className="w-full flex items-center gap-2 sm:gap-5 justify-between">
        <Link href="/" className="inline-flex items-center justify-center gap-2 w-fit px-2 py-1.5 rounded-md cursor-pointer bg-black" >
          <GrFormPrevious className="text-sm text-white" />
          <span className="text-sm text-white">Return to home</span>
        </Link>
        <div
          className="w-fit px-2 py-1.5 rounded-md cursor-pointer bg-black  text-xl inline-flex items-center justify-center gap-2"

        >
          <span className="hidden xs:inline text-sm text-red-500">Information about signing up</span>
          <FaCircleInfo className="text-red-500 text-xl xs:text-base" />
        </div>
      </div>

      <div className="w-full bg-[#171717] px-4 rounded-xl mx-auto flex flex-col gap-5 p-5">


        <h2 className="text-2xl text-white">Sign up in Coffee Uni</h2>

        <form onSubmit={handleSubmit(registerUser)} className="w-full flex flex-col justify-center items-center lg:items-start gap-7">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-7">
            <div className="w-full relative select-none">
              <input
                type="text"
                className="w-full rounded-md p-3 border border-light-gray border-gray-600 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                {...register('firstname')}
              />
              <span className="absolute peer-focus:text-sky-500 bg-[#171717] transition-all -top-3 left-2 px-2 text-gray-600">FirstName</span>
              {errors?.firstname && (
                <span className="text-red-500 text-sm mt-2">{errors.firstname?.message}</span>
              )}
            </div>

            <div className="w-full relative select-none">
              <input
                type="text"
                className="w-full rounded-md p-3 border border-light-gray border-gray-600 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                {...register('lastname')}
              />
              <span className="absolute peer-focus:text-sky-500 bg-[#171717] transition-all -top-3 left-2 px-2 text-gray-600">LastName</span>
              {errors?.lastname && (
                <span className="text-red-500 text-sm mt-2">{errors.lastname?.message}</span>
              )}
            </div>
          </div>

          <div className="w-full relative select-none">
            <input
              type="text"
              className="w-full rounded-md p-3 border border-light-gray border-gray-600 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
              {...register('email')}
            />
            {errors?.email && (
              <span className="text-red-500 text-sm mt-2">{errors.email?.message}</span>
            )}
            <span className="absolute peer-focus:text-sky-500 bg-[#171717] transition-all -top-3 left-2 px-2 text-gray-600">Email</span>
          </div>

          <div className="w-full relative select-none">
            <input
              type="text"
              className="w-full rounded-md p-3 border border-light-gray border-gray-600 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
              {...register('username')}
            />
            <span className="absolute peer-focus:text-sky-500 bg-[#171717] transition-all -top-3 left-2 px-2 text-gray-600">userName</span>
            {errors?.username && (
              <span className="text-red-500 text-sm mt-2">{errors.username?.message}</span>
            )}
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-7">
            <div className="w-full relative select-none">
              <div className="w-full relative">
                <input
                  type={`${showPass ? 'text' : 'password'}`}
                  className="w-full rounded-md p-3 border border-light-gray border-gray-600 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors pr-5" minLength={8} maxLength={16}
                  {...register('password')}
                />
                <span className="absolute peer-focus:text-sky-500 bg-[#171717] transition-all -top-3 left-2 px-2 text-gray-600">Password</span>
                <div onClick={() => setShowPass(prev => !prev)} className="absolute right-5 bottom-1/2 translate-1/2 cursor-pointer select-none text-gray-600 transition-all peer-focus:!text-sky-500">
                  {showPass ? (
                    <PiEyeClosedBold className="text-2xl" />
                  ) : (
                    <PiEyeBold className="text-2xl" />
                  )}
                </div>
              </div>
              {errors?.password && (
                <span className="text-red-500 text-sm mt-2">{errors.password?.message}</span>
              )}
            </div>

            <div className="w-full relative select-none">
              <div className="w-full relative">
                <input
                  type={`${repeatShowPass ? 'text' : 'password'}`}
                  className="w-full rounded-md p-3 border border-light-gray border-gray-600 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors pr-5" minLength={8} maxLength={16}
                  {...register('repeatPassword')}
                />
                <span className="absolute peer-focus:text-sky-500 bg-[#171717] transition-all -top-3 left-2 px-2 text-gray-600">Repeat Password</span>
                <div onClick={() => setRepeatShowPass(prev => !prev)} className="absolute right-5 bottom-1/2 translate-1/2 cursor-pointer select-none text-gray-600 transition-all peer-focus:!text-sky-500">
                  {repeatShowPass ? (
                    <PiEyeClosedBold className="text-2xl" />
                  ) : (
                    <PiEyeBold className="text-2xl" />
                  )}
                </div>
              </div>
              {errors?.repeatPassword && (
                <span className="text-red-500 text-sm mt-2">{errors.repeatPassword?.message}</span>
              )}
            </div>
          </div>

          <button className="w-full py-4 rounded-md cursor-pointer bg-sky-500 hover:bg-sky-600 transition-colors text-white font-bold">Sign Up</button>

          <div className="w-full flex items-center justify-between -mt-4">
            <span className="ms-2 text-sm text-gray-300 select-none">Already Have An Account?</span>
            <Link href="/SignIn" className="w-fit text-sm px-2 py-1 rounded-md cursor-pointer font-light bg-black text-white">Sign In</Link>
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

SignUp.noLayout = true

export default SignUp

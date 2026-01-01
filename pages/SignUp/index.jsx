import React, { useState } from 'react'

import toast, { Toaster } from 'react-hot-toast';

import { PiEyeBold } from "react-icons/pi";
import { PiEyeClosedBold } from "react-icons/pi";
import { FaCircleInfo } from "react-icons/fa6";
import { GrFormPrevious } from "react-icons/gr";
import Link from 'next/link';


function SignUp() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const [userNameTestingFlag, setUserNameTestingFlag] = useState(false)
  const [userNameValidFlag, setUserNameValidFlag] = useState(null)

  // let validationObj = { email: false, userName: false, password: { equality: false, valid: false } } // when we want to submit the form all inputs must be validate

  const [showPass, setShowPass] = useState(false)
  const [repeatShowPass, setRepeatShowPass] = useState(false)

  let emailRegex = /^\S+@\S+\.\S+$/
  let userNameRegex = /^[0-9A-Za-z_.]+$/
  let passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#@_.])(?!.* ).{8,16}$/
  let numberRegex = /[0-9]/
  let lowerCaseLetterRegex = /[a-z]/
  let upperCaseLetterRegex = /[A-Z]/
  let symbolRegex = /[@#_.]/

  const errorNotify = text => {
    toast.error(text)
  }

  const checkPassEquality = () => {
    if (password == repeatPassword) {
      validationObj.password.equality = true
    } else {
      errorNotify('رمز های عبور یکسان نیستتند')
      validationObj.password.equality = false
    }
  }

  const isAllInputsValid = () => {
    let isValid = false

    let { email, userName, password } = validationObj
    console.log('email -> ', email, 'userName -> ', userName, 'password equality -> ', password.equality, 'password valid -> ', password.valid, validationObj)
    if (email && userName && password.equality && password.valid) {
      isValid = true
    }

    return isValid
  }

  const testEmail = () => {
    let emailFlag = emailRegex.test(email)

    if (!emailFlag && email) {
      errorNotify('Email is invalid')
      validationObj.email = false
    } else {
      validationObj.email = true
    }
  }

  const testUserName = async () => {
    let userNameFlag = userNameRegex.test(userName)

    if (!userNameFlag && !userName.trim()) {
      errorNotify('userName is invalid')
      validationObj.userName = false
      console.log('notValid')
    } else {
      setUserNameTestingFlag(true)
      await checkUserNameExist()
    }
  }

  const testPassword = pass => {
    let passwordFlag = passwordRegex.test(pass)

    if (!passwordFlag && pass) {
      // toast.error('رمز عبور درست نيست')
      validationObj.password.valid = false

      if (!numberRegex.test(pass)) {
        errorNotify('Password must at least have 1 number')
      }

      if (!lowerCaseLetterRegex.test(pass)) {
        errorNotify('Password must at least have 1 lower letter')
      }

      if (!upperCaseLetterRegex.test(pass)) {
        errorNotify('Password must at least have 1 capital letter')
      }

      if (!symbolRegex.test(pass)) {
        errorNotify('Password must at least have 1 character (@ or # or _ or .)')
      }

      if (pass.length < 8) {
        errorNotify('Password must at least have 8 letters')
      }

    } else {
      validationObj.password.valid = true
    }

    checkPassEquality()
  }


  return (
    <div className="w-9/10 sm:w-4/5 md:w-1/2 lg:w-1/3 mx-auto flex flex-col items-start justify-center gap-5 py-5 pt-5">
      <div className="w-full flex items-center gap-2 sm:gap-5 justify-between">
        <Link href="/" className="inline-flex items-center justify-center gap-2 w-fit px-2 py-1.5 rounded-md cursor-pointer bg-black" >
          <GrFormPrevious className="text-sm text-gray-500 text-white" />
          <span className="text-sm text-gray-500 text-white">Return to home</span>
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

        <form className="w-full flex flex-col justify-center items-center lg:items-start gap-7">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-7">
            <div className="w-full relative select-none">
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full rounded-md p-3 border border-light-gray border-gray-600 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors" maxLength={20} required />
              <span className="absolute peer-focus:text-sky-500 bg-[#171717] transition-all -top-3 left-2 px-2 text-gray-600">FirstName</span>
            </div>

            <div className="w-full relative select-none">
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full rounded-md p-3 border border-light-gray border-gray-600 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors" maxLength={20} required />
              <span className="absolute peer-focus:text-sky-500 bg-[#171717] transition-all -top-3 left-2 px-2 text-gray-600">LastName</span>
            </div>
          </div>

          <div className="w-full relative select-none">
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-md p-3 border border-light-gray border-gray-600 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
              // onBlur={testEmail}
            />
            <span className="absolute peer-focus:text-sky-500 bg-[#171717] transition-all -top-3 left-2 px-2 text-gray-600">Email</span>
          </div>

          <div className="w-full relative select-none">
            <input
              type="text"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              className="w-full rounded-md p-3 border border-light-gray border-gray-600 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
              onBlur={testUserName}
            />
            <span className="absolute peer-focus:text-sky-500 bg-[#171717] transition-all -top-3 left-2 px-2 text-gray-600">userName</span>
            {/* {userNameTestingFlag && (
              <div className="flex items-center justify-start gap-2 mt-2 text-sm">
                <span className= text-sky-500">در حال بررسی  وجود نام کاربری</span>
                <span className="inline-block w-4 h-4 rounded-full border-2 border-gray-200 border-secondary !border-t-sky-500 animate-spin"></span>
              </div>
            )} */}

            {/* {!userNameTestingFlag && userNameValidFlag != null && (
              <span className={`mt-2 text-sm ${userNameValidFlag ? 'text-green-500' : 'text-red-500'}`}>
                {userNameValidFlag ? 'نام کاربری معتبر است' : 'نام کاربری معتبر نیست'}
              </span>
            )} */}

          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-7">
            <div className="w-full relative select-none">
              <input
                type={`${showPass ? 'text' : 'password'}`}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-md p-3 border border-light-gray border-gray-600 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors pr-5" minLength={8} maxLength={16}
                // onBlur={e => testPassword(password)}
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

            <div className="w-full relative select-none">
              <input
                type={`${repeatShowPass ? 'text' : 'password'}`}
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)}
                className="w-full rounded-md p-3 border border-light-gray border-gray-600 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors pr-5" minLength={8} maxLength={16}
                // onBlur={e => testPassword(repeatPassword)}
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
          </div>

          <button className="w-full py-4 rounded-md cursor-pointer bg-sky-500 hover:bg-sky-600 transition-colors text-white font-bold">Sign Up</button>

          <div className="w-full flex items-center justify-between -mt-4">
            <span className="ms-2 text-sm text-gray-300 select-none">Already Have An Account?</span>
            <Link href="/SignIn" className="w-fit text-sm px-2 py-1 rounded-md cursor-pointer font-light bg-black text-gray-500 text-white">Sign In</Link>
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

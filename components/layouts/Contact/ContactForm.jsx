import { useState } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

import Title from '@/components/modules/Title/Title'

import { TiLocationOutline } from "react-icons/ti";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaBusinessTime } from "react-icons/fa";

let toastId = null;

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const schema = yup.object().shape({
    name: yup
      .string()
      .min(2, "name must be at least 2 characters")
      .required("name is required"),

    email: yup
      .string()
      .email("Invalid email")
      .required("email is required"),

    message: yup
      .string()
      .min(5, "message must be at least 5 characters")
      .required("message  is required"),
  });

  let {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schema)
  })

  const submitForm = async data => {
    console.log(data)
    setIsSubmitting(true)
    toastId = toast.loading('Submitting Form')

    let newContact = { name: data.name, email: data.email, message: data.message }

    try {
      let res = await fetch('/api/contact', {
        method: "POST",
        headers : {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(newContact)
      })
      // console.log(res)
      if (res.status == 201) {
        toast.dismiss(toastId)
        toast.success('Form Submitted Successfully')
        toast.success('Our Team will get in touch with you ASAP ,tnx for your patience')

        // reset input value
        setValue('name', '')
        setValue('email', '')
        setValue('message', '')
      }

    } catch (err) {
      toast.dismiss(toastId)
      toast.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pb-16 container px-5 py-1 mx-auto relative w-full min-h-screen gap-7">
      <div className="flex flex-col gap-5">
        <Title title="Contact Us" />
        <p className="text-white text-lg text-center md:text-justify">We’d Love to Hear From You</p>
      </div>

      <div className="flex flex-col md:flex-col lg:flex-row items-start justify-start gap-7 mt-5">
        {/* left-side contact */}
        <div className="w-full h-full rounded-4xl overflow-hidden p-3 flex flex-col sm:flex-row items-start gap-7 border border-[#1f1f1f] bg-[#0f0f0f]">

          <div className="w-full lg:min-w-1/2 h-[calc[100vh-5rem]] md:h-[calc(75vh-1rem)] rounded-2xl overflow-hidden">
            <img src="Images/Contact-1.jpg" className="object-cover object-center w-full h-full" alt="" />
          </div>

          <div className="w-full flex flex-col items-start gap-5">

            <div className="flex flex-col items-start justify-start md:items-center md:justify-between md:items-start md:justify-start w-full gap-2">
              <div className="flex items-center gap-2">
                <TiLocationOutline className="text-white text-2xl" />
                <h2 className="text-white font-sans text-xl">Address : </h2>
              </div>

              <h2 className="text-gray-400 font-sans text-lg sm:text-xl lg:text-lg">123 , Coffee Uni , Isfahan(Ashrafi)</h2>
            </div>

            <div className="flex flex-col items-start justify-start md:items-center md:justify-between md:items-start md:justify-start w-full gap-2">
              <div className="flex items-center gap-2">
                <IoCall className="text-white text-2xl" />
                <h2 className="text-white font-sans text-xl">Phone : </h2>
              </div>

              <h2 className="text-gray-400 font-sans text-lg sm:text-xl lg:text-lg">+1234567890</h2>
            </div>

            <div className="flex flex-col items-start justify-start md:items-center md:justify-between md:items-start md:justify-start w-full gap-2">
              <div className="flex items-center gap-2">
                <MdEmail className="text-white text-2xl" />
                <h2 className="text-white font-sans text-xl">Email : </h2>
              </div>

              <h2 className="text-gray-400 font-sans text-lg sm:text-xl lg:text-lg">CofeeUni@gmail.com</h2>
            </div>

            <div className="flex flex-col items-start justify-start w-full gap-3">
              <div className="flex items-center gap-2">
                <FaBusinessTime className="text-white text-2xl" />
                <h2 className="text-white font-sans text-xl">Work Time :</h2>
              </div>
              <div className="flex flex-col gap-">
                <h2 className="text-gray-400 font-sans text-lg sm:text-xl lg:text-lg">Mon - Fri : 8:00 - 22:00</h2>
                <h2 className="text-gray-400 font-sans text-lg sm:text-xl lg:text-lg">Sat - Sun : 9:00 - 23:00</h2>
              </div>
            </div>

          </div>

        </div>
        {/* right-side contact */}
        <div className="w-full rounded-md flex flex-col md:items-start items-center justify-center gap-4 sm:gap-6 py-5">

          <form className="w-full flex flex-col justify-center items-center lg:items-start gap-7" onSubmit={handleSubmit(submitForm)}>

            <div className="w-full flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-7">

                <div className="w-full relative select-none">
                  <input
                    type="text"
                    className="w-full rounded-md p-3 border border-light-gray border-gray-500 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                    {...register('name')}
                  />
                  <span className="absolute peer-focus:text-sky-500 bg-black transition-all -top-3 left-2 px-2 text-gray-500">name</span>
                  {errors?.name && (
                    <span className="text-red-500 text-sm mt-2">{errors.name?.message}</span>
                  )}
                </div>

                <div className="w-full relative select-none">
                  <input
                    type="text"
                    className="w-full rounded-md p-3 border border-light-gray border-gray-500 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors"
                    {...register('email')}
                  />
                  <span className="absolute peer-focus:text-sky-500 bg-black transition-all -top-3 left-2 px-2 text-gray-500">email</span>
                  {errors?.email && (
                    <span className="text-red-500 text-sm mt-2">{errors.email?.message}</span>
                  )}
                </div>

                <div className="sm:col-start-1 sm:col-end-3  w-full relative select-none">
                  <textarea
                    {...register('message')}
                    className="w-full min-h-28 rounded-md p-3 border border-light-gray border-gray-500 text-white outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors pr-5"
                  ></textarea>
                  <span className="absolute peer-focus:text-sky-500 bg-black transition-all -top-3 left-2 px-2 text-gray-500">message</span>
                  {errors?.message && (
                    <span className="text-red-500 text-sm mt-2">{errors.message?.message}</span>
                  )}
                </div>
              </div>

              <button
                className="w-full py-2 rounded-md cursor-pointer bg-sky-700 hover:bg-sky-600 disabled:bg-sky-400 transition-colors text-white font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default ContactForm
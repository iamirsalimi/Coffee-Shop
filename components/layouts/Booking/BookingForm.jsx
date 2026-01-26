import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

import Title from '@/components/modules/Title/Title'
import { useAuth } from '@/Context/AuthContext';

let toastId = null;

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

function BookingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    let { user } = useAuth()

    const schema = yup.object().shape({
        fullname: yup
            .string()
            .min(2, "fullname must be at least 2 characters")
            .required("fullname is required"),

        phone: yup
            .string()
            .matches(phoneRegex, 'PhoneNumber is invalid')
            .required("phone is required"),

        date: yup
            .date('date is not valid')
            .required("date is required"),
        time: yup
            .string()
            .required("time is required"),

        guests: yup
            .number("must be a number ")
            .max(30, 'you can invite maximum 30 guests')
            .required("guests is required"),

        description: yup
            .string()
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
        // console.log(data)
        setIsSubmitting(true)
        toastId = toast.loading('Submitting Form')

        let newBooking = { ...data, username: user.username }

        try {
            let res = await fetch('/api/booking', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBooking)
            })

            // let resData = await res.json()

            if (res.status == 201) {
                toast.dismiss(toastId)
                toast.success('Form Submitted Successfully')
                toast.success('Our Team will get in touch with you ASAP , tnx for your patience')

                // reset input value
                setValue('fullname', '')
                setValue('phone', '')
                setValue('date', '')
                setValue('time', '')
                setValue('guests', '')
                setValue('description', '')
            }

        } catch (err) {
            toast.dismiss(toastId)
            toast.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }


    const getMinDate = () => {
        let dtToday = new Date() // booking only possible 7 days before the actual date
        dtToday.setTime(new Date().getTime() + (7 * 24 * 60 * 60 * 1000));
        let month = dtToday.getMonth() + 1;
        let day = dtToday.getDate();
        let year = dtToday.getFullYear();

        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();

        return `${year}-${month}-${day}`;
    }

    return (
        <div className="py-16 w-full min-h-screen bg-black">
            <div className="container mx-auto px-5 py-10 w-full h-full flex flex-col gap-8 items-start justify-start">
                <Title title="Book A Table" />
                <p className="text-white text-lg text-center md:text-justify">Please fill in the details below to reserve your table. We’ll confirm your booking as soon as possible</p>
                <form className="w-full flex flex-col justify-center items-center lg:items-start gap-7" onSubmit={handleSubmit(submitForm)}>
                    <div className="w-full flex flex-col gap-5">
                        <div className="w-full p-4 border border-[#1f1f1f] rounded-2xl space-y-4 bg-[#0f0f0f] text-center">
                            <h2 className="text-lg font-semibold text-white">
                                Good to Know
                            </h2>

                            <ul className="flex flex-col items-center gap-2 text-sm text-gray-400 list-disc pl-5">
                                <li className="text-gray-200 text-center md:text-justify">Bookings can be made up to 7 days in advance</li>
                                <li className="text-gray-200 text-center md:text-justify">Please arrive on time to keep your reservation</li>
                                <li className="text-gray-200 text-center md:text-justify">For large groups, contact us directly (more than 30 guests)</li>
                            </ul>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-12 pt-5">

                            <div className="w-full relative select-none">
                                <input
                                    type="text"
                                    className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                    {...register('fullname')}
                                />
                                <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">fullname</span>
                                {errors?.fullname && (
                                    <span className="text-red-500 text-sm mt-2">{errors.fullname?.message}</span>
                                )}
                            </div>

                            <div className="w-full relative select-none">
                                <input
                                    type="text"
                                    className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                    {...register('phone')}
                                />
                                <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">Phone Number</span>
                                {errors?.phone && (
                                    <span className="text-red-500 text-sm mt-2">{errors.phone?.message}</span>
                                )}
                            </div>

                            <div className="w-full relative select-none">
                                <input
                                    type="date"
                                    {...register('date')}
                                    min={getMinDate()}
                                    className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                />
                                <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">Date</span>

                                <span className="text-gray-300 text-xs font-sans block mt-2 ml-1">soonest possible date : {getMinDate()}</span>
                                {errors?.date && (
                                    <span className="text-red-500 text-sm mt-2">{errors.date?.message}</span>
                                )}
                            </div>

                            <div className="w-full relative select-none">
                                <input
                                    type="time"
                                    {...register('time')}
                                    className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                    min="08:00 AM"
                                    max="11:00 PM"
                                />
                                <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">time</span>
                                {errors?.time && (
                                    <span className="text-red-500 text-sm mt-2">{errors.time?.message}</span>
                                )}
                            </div>

                            <div className="md:col-start-1 md:col-end-3 w-full relative select-none">
                                <input
                                    type="number"
                                    {...register('guests')}
                                    className="w-full rounded-2xl p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base pr-5" min={0} max={30}
                                />
                                <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">Number Of Guests</span>
                                {errors?.guests && (
                                    <span className="text-red-500 text-sm mt-2">{errors.guests?.message}</span>
                                )}
                            </div>
                            <div className="md:col-start-1 md:col-end-3  w-full relative select-none">
                                <textarea
                                    {...register('description')}
                                    className="w-full min-h-32 rounded-2xl resize-x-none p-3 border border-[#1f1f1f] bg-[#0f0f0f] disabled:bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 transition-colors text-sm md:text-base"
                                ></textarea>
                                <span className="absolute peer-focus:text-sky-500 transition-all -top-7 left-0 bg-black text-gray-500">Description</span>
                                {errors?.description && (
                                    <span className="text-red-500 text-sm mt-2">{errors.description?.message}</span>
                                )}
                            </div>
                        </div>

                        <button
                            className="w-full py-2 rounded-2xl cursor-pointer bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 transition-colors text-black font-bold"
                            disabled={!user || isSubmitting}
                        >
                            {isSubmitting ? 'Reserving...' : 'Reserve Table'}
                        </button>
                    </div>
                </form>
                <div className="w-full text-center flex flex-col items-center gap-2">
                    <p className="text-center font-bold text-white">Need help with your reservation?</p>
                    <p className="text-center font-bold text-gray-500">Visit our <Link className="underline" href="/Contact">contact</Link> page or call us directly.</p>
                </div>
            </div>
        </div>
    )
}

export default BookingForm

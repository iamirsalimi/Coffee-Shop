import React, { useEffect, useState } from 'react'
import Link from 'next/link';

import { useAuth } from '@/Context/AuthContext';
import { useBasket } from '@/Context/BasketContext';

import PanelSideBar from '@/components/modules/PanelSideBar/PanelSideBar';
import BookingBox from '@/components/modules/BookingBox/BookingBox';

import { MdKeyboardArrowLeft } from "react-icons/md";
import CancelBookingModal from '@/components/modules/CancelBookingModal/CancelBookingModal';


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

function Booking() {
    const [loading, setLoading] = useState(true)
    const [bookings, setBookings] = useState(null)
    const [err, setErr] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [currentId, setCurrentId] = useState(null)
    const [currentDate, setCurrentDate] = useState(false)
    const [isCanceling, setIsCanceling] = useState(false)

    // console.log('Booking ', Booking);

    const { user } = useAuth();
    // console.log(user) 

    const cancelBooking = async () => {
        try {
            setIsCanceling(true)

            let newBooking = { status: 'CANCELED' }

            let res = await fetch(`/api/booking/${currentId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBooking)
            })

            let resData = await res.json()
            console.log(resData)

            if (res.status == 200) {
                setShowModal(false)
                setBookings(booking => booking.map(bookingItem => {
                    if (bookingItem._id == resData._id) {
                        bookingItem.status = resData.status
                    }
                    return bookingItem
                }))
                // setGetBookingData(prev => !prev)
            }

        } catch (err) {
            setShowModal(false)
            console.log(err)
        } finally {
            setIsCanceling(false)
        }
    }

    useEffect(() => {
        let getBookings = async () => {
            try {
                let res = await fetch(`/api/booking/username/${user.username}`)
                const resData = await res.json()

                // console.log('Booking res ', resData)
                setBookings(resData)
            } catch (err) {
                setErr(err)
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        if (user) {
            getBookings()
        }
    }, [user])

    return (
        <div className="flex gap-5 max-h-fit lg:max-h-screen overflow-hidden pb-20 md:pb-10 lg:pb-0">
            <PanelSideBar />
            <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">

                <div className="w-full flex flex-row items-center justify-between">
                    <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
                        <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
                        <span className="text-xs xs:text-sm">Return to Home Page</span>
                    </Link>
                    <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Booking History</span>
                </div>

                <div className="flex flex-col gap-3 min-h-[80vh] max-h-[80vh] place-content-start lg:pr-5 p-5 rounded-3xl bg-black overflow-y-auto">
                    {!loading ? bookings.length > 0 ? (
                        <>
                            <span className="text-red-500 select-none text-xs lg:text-sm text-center -mt-3 p-3 border border-red-500 bg-red-900/5 rounded-xl">Warning : before canceling your booking please make sure you won't change your mind later , because once you cancel a booking you won't be able to change it later. if you had done this and you're reading this know and you want to change your booking status , you can always contact us via form in <Link href="/Contact" className="underline">Contact</Link> page or through our number or email.</span>

                            {bookings.map(booking => (
                                <BookingBox booking={booking._id} {...booking} setShowModal={setShowModal} setCurrentDate={setCurrentDate} setCurrentId={setCurrentId} />
                            ))}
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2 my-auto">
                            <h2 className=" text-white text-center font-bold text-sm sm:text-base md:text-xl">you haven't Booked a table yet</h2>
                        </div>
                    ) : (
                        <div className="text-white text-center font-bold text-xl my-auto">Loading Bookings...</div>
                    )}
                </div>
            </div>
            <CancelBookingModal showModal={showModal} setShowModal={setShowModal} date={currentDate} cancelBookingHandler={cancelBooking} isCanceling={isCanceling} />
        </div>
    )
}


Booking.noLayout = true

export default Booking
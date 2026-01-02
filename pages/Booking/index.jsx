import Header from '@/components/layouts/Booking/Header'
import BookingForm from '@/components/layouts/Booking/BookingForm'
import React from 'react'

function Booking() {
  return (
    <div className="w-full h-full flex flex-col">
        <Header />
        <BookingForm />
    </div>
  )
}

export default Booking
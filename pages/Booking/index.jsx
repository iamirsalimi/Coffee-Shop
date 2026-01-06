import Header from '@/components/layouts/Booking/Header'
import BookingForm from '@/components/layouts/Booking/BookingForm'
import React from 'react'
import { Toaster } from 'react-hot-toast';

export const getStaticProps = () => {
  return {
    props: {

    }
  }
}

function Booking() {
  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <BookingForm />
      <Toaster
        position="top-left"
        reverseOrder={false}
      />
    </div>
  )
}

export default Booking
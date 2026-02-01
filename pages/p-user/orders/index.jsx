
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Head from 'next/head';

import PanelSideBar from '@/components/modules/PanelSideBar/PanelSideBar';
import OrderBox from '@/components/modules/OrderBox/OrderBox';

import Users from '@/src/Models/User'
import { useAuth } from '@/Context/AuthContext';
import { verifyRefreshToken } from '@/src/utils/auth';
import {autoFetch} from '@/utils/autoFetch';

import { MdKeyboardArrowLeft } from "react-icons/md";

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

function Orders() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState(null)
  const [err, setErr] = useState(null)

  // console.log('Booking ', Booking);

  const { user } = useAuth();
  // console.log(user) 

  useEffect(() => {
    let getOrders = async () => {
      try {
        let res = await autoFetch(`/api/orders/${user._id}`)
        const resData = await res.json()

        console.log('Orders res ', resData)
        setOrders(resData)
      } catch (err) {
        setErr(err)
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    if (user) {
      getOrders()
    }
  }, [user])

  return (
    <div className="flex gap-5 max-h-fit lg:max-h-screen overflow-hidden pb-20 md:pb-10 lg:pb-0">
      <PanelSideBar />
      <Head>
        <title>Coffee Uni | Orders</title>
      </Head>
      <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f]">

        <div className="w-full flex flex-row items-center justify-between">
          <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
            <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
            <span className="text-xs xs:text-sm">Return to Home Page</span>
          </Link>
          <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Orders History</span>
        </div>

        <div className="flex flex-col gap-3 min-h-[80vh] max-h-[80vh] place-content-start lg:pr-5 p-5 rounded-3xl bg-black overflow-y-auto">
          {!loading ? orders.length > 0 ? (
            <>
              {/* Update Profile guideLines */}
              <ul className="flex flex-col gap-2 text-sm p-5 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 list-disc pl-5">
                <li>
                  after submitting order you can pay and get your product by going to our coffee shop
                </li>
                <li>
                  if you want a receipt you can get that by the till from our cashier after paying
                </li>
                <li>
                  before ordering please check the time to see if our shop is open or not and if you had ordered when the shop is closed your order will be postpone to next day
                </li>
              </ul>

              {orders.map(order => (
                <OrderBox key={order._id} {...order} />
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 my-auto">
              <h2 className=" text-white text-center font-bold text-sm sm:text-base md:text-xl">you haven't Ordered anything yet</h2>
            </div>
          ) : (
            <div className="text-white text-center font-bold text-xl my-auto">Loading Orders...</div>
          )}
        </div>
      </div>
    </div>
  )
}


Orders.noLayout = true

export default Orders
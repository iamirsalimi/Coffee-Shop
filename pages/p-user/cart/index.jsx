import React, { useRef, useState } from 'react'
import Link from 'next/link';
import Head from 'next/head';
import toast, { Toaster } from 'react-hot-toast';

import PanelSideBar from '@/components/modules/PanelSideBar/PanelSideBar';
import BasketProductCart from '@/components/modules/BasketProductCart/BasketProductCart';

import Users from '@/src/Models/User'
import { useAuth } from '@/Context/AuthContext';
import { useBasket } from '@/Context/BasketContext';
import { verifyRefreshToken } from '@/src/utils/auth';
import {autoFetch} from '@/utils/autoFetch';

import { MdKeyboardArrowLeft } from "react-icons/md";

let toastId = null;

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
        user: JSON.parse(JSON.stringify(user))
      }
    }
  } catch (err) {
    return {
      props: {

      }
    }
  }
}

function Cart({ user }) {
  const [description, setDescription] = useState('')
  const [delayCheckbox, setDelayCheckbox] = useState(false)
  const [delayInput, setDelayInput] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { loading, setGetData } = useAuth()
  const { basket } = useBasket()

  const allItemsCount = () => {
    let basketTotalCount = basket.reduce((prev, cur) => (
      prev + cur.quantity
    ), 0)
    return basketTotalCount
  }

  const clearBasket = async () => {
    try {
      let res = await autoFetch('/api/user/basket/-1', {
        method: "DELETE"
      })

      // console.log(res)

      if (res.status == 200) {
        setGetData(prev => !prev)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const finalizeOrder = async () => {
    try {
      toastId = toast.loading('Submitting Order')
      setIsSubmitting(true)

      let newOrder = {
        userId: user._id,
        orders: [...basket],
        totalPrice: Number(calcTotalPrice()),
        description,
        isDelayed: delayCheckbox,
        minutesDelayed: delayCheckbox ? Number(delayInput) : 0
      }

      console.log(newOrder)

      let res = await autoFetch('/api/orders', {
        method: "POST",
        body: JSON.stringify(newOrder)
      })

      let resData = await res.json()
      console.log(res, resData)
      if (res.status == 201) {
        await clearBasket()

        toast.dismiss(toastId)
        toast.success(resData.message)
      }

    } catch (err) {
      console.log(err)

      toast.dismiss(toastId)
      toast.error(err.message)
    } finally {
      toastId = null;
      setIsSubmitting(false)
    }
  }

  const calcTotalPrice = () => {
    const totalPrice = basket.reduce((prev, cur) => (prev + (cur.quantity * cur.price)), 0).toFixed(2)
    return totalPrice
  }

  return (
    <div className="flex gap-5 max-h-fit lg:max-h-screen overflow-hidden ">
      <PanelSideBar />
      <Head>
        <title>Coffee Uni | Cart</title>
      </Head>
      <div className="w-full lg:w-3/4 min-h-screen h-full ml-auto p-4 flex flex-col gap-7 bg-[#0f0f0f] pb-30 md:pb-25 lg:pb-10">

        <div className="w-full flex flex-row items-center justify-between">
          <Link href="/" className="flex items-center p-1 xs:p-2 rounded-xl border border-[#1f1f1f] bg-black text-gray-400 cursor-pointer transition-all">
            <MdKeyboardArrowLeft className="stroke-white text-xl xs:text-2xl" />
            <span className="text-xs xs:text-sm">Return to Home Page</span>
          </Link>
          <span className="text-white font-bold text-xs xs:text-sm sm:text-base">Shopping Cart</span>
        </div>

        <div className="grid lg:grid-cols-3 grid-cols-1 gap-5 min-h-[83vh] place-content-center lg:pr-5">
          <div className="max-h-[83vh] overflow-y-auto lg:col-start-1 lg:col-end-3 p-4 rounded-3xl border border-[#1f1f1f] bg-black text-gray-400 flex flex-col gap-2">

            {!loading ? (
              <>
                {basket?.length > 0 ? basket?.map(cart => (
                  <BasketProductCart key={cart._id} borderFlag productId={cart._id} {...cart.product} size={cart.size} quantity={cart.quantity} price={cart.price} />
                )) : (
                  <div className="w-full flex flex-col gap-5 items-center my-auto">
                    <h2 className="text-center text-white font-sans text-2xl">Your Basket is Empty</h2>
                    <Link href="/Menu" className="px-4 py-2 rounded-xl cursor-pointer bg-amber-500 hover:bg-amber-600 text-[#0f0f0f] font-bold transition-colors">Order</Link>
                  </div>
                )}
              </>
            ) : (
              <div className="text-white text-center my-auto">Loading...</div>
            )}
          </div>

          <ul className="p-4 w-full min-w-max rounded-3xl border border-[#1f1f1f] bg-black text-gray-400 flex flex-col min-h-[83vh] max-h-[83vh]">
            <li className="flex items-center justify-between py-1">
              <h3 className="text-white font-bold">Items Count : </h3>
              <span className="text-gray-300">{allItemsCount()}</span>
            </li>
            <li className="flex items-center justify-between py-1 border-t border-[#1f1f1f]">
              <h3 className="text-white font-bold">Total Price : </h3>
              <span className="text-gray-300"><span className="text-sm text-gray-500">$</span>{calcTotalPrice()}</span>
            </li>
            <li className="max-w-full flex flex-col h-full items-start gap-2 py-1 border-t border-[#1f1f1f]">
              <h3 className="text-white font-bold">Description : </h3>

              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full rounded-xl p-3 border border-[#1f1f1f] bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 focus:placeholder:text-white/25 placeholder:text-white/25 transition-colors min-w-full min-h-52 max-h-52 h-full resize-none"
                placeholder='Please add more Sugar and Milk and ...'
                disabled={basket.length == 0}
              ></textarea>

              <div className="w-full flex flex-col gap-2">
                <div className="flex items-center justify-start gap-1 pl-1">

                  <input
                    type="checkbox"
                    id="delayCheckbox"
                    className="accent-sky-500"
                    onChange={e => {
                      setDelayCheckbox(e.target.checked)
                      if (!e.target.checked) {
                        setDelayInput('')
                      }
                    }}
                    checked={delayCheckbox}
                    disabled={basket?.length == 0}
                  />

                  <label htmlFor="delayCheckbox" className="text-white text-xs select-none">
                    I arrive late to coffee shop
                  </label>

                </div>

                <div className="w-full flex flex-col gap-1">

                  <input
                    type="number"
                    className="w-full rounded-xl p-2 border border-[#1f1f1f] bg-black outline-none peer focus:border-sky-500 focus:text-sky-500 focus:placeholder:text-white/25 placeholder:text-white/25 transition-colors min-w-full h-full text-sm"
                    value={delayInput}
                    onChange={e => setDelayInput(e.target.value)}
                    placeholder='In minutes , between 0 - 90 (minutes)'
                    disabled={!delayCheckbox}
                    min={0}
                    max={90}
                  />

                  <span className="text-gray-400 text-xs">between 0 - 90</span>

                </div>
              </div>

            </li>

            <button
              onClick={finalizeOrder}
              className="w-full rounded-2xl bg-green-500 disabled:bg-green-300 hover:bg-green-600 transition-all text-white font-bold cursor-pointer py-2"
              disabled={basket.length == 0 || isSubmitting}
            >{basket.length != 0 && isSubmitting ? 'Submitting Order' : 'Finalize Order'}</button>
          </ul>
        </div>
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </div>
  )
}

Cart.noLayout = true

export default Cart
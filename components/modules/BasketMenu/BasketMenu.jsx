import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

import { useBasket } from '@/Context/BasketContext'

import BasketProductCart from '../BasketProductCart/BasketProductCart'

let toastId = null;

function BasketMenu({ showBasketMenu, setShowBasketMenu }) {
    const [removeFlag, setRemoveFlag] = useState(false)
    const hideMenu = () => setShowBasketMenu(false)

    const { basket, setGetData } = useBasket()

    const clearBasket = async () => {
        try {
            setRemoveFlag(true)
            toastId = toast.loading('Resetting basket')

            let res = await fetch('/api/user/basket/-1', {
                method: "DELETE"
            })

            // console.log(res)

            if (res.status == 200) {
                toast.dismiss(toastId)
                toast.success('basket cleared Successfully')
                setGetData(prev => !prev)
            }
        } catch (err) {
            toast.dismiss(toastId)
            toast.error('Unknown err in clearing basket')
            console.log(err)
        } finally {
            setRemoveFlag(false)
        }
    }

    const calcTotalPrice = () => {
        const totalPrice = basket.reduce((prev, cur) => (prev + (cur.quantity * cur.price)), 0).toFixed(2)
        return totalPrice
    }

    return (
        <AnimatePresence>
            {showBasketMenu && (
                <div className="w-full">
                    <motion.div
                        className="fixed inset-0 z-50 bg-black py-2 px-5 flex flex-col place-content-start gap-2 h-screen w-full md:w-2/3 lg:w-1/2 lg:max-w-[40rem]"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{
                            duration: 0.6,
                            ease: 'easeInOut'
                        }}
                    >
                        {/* header of the navbar */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <motion.h3
                                className="text-gray-200 text-3xl font-bold"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55, duration: 0.4 }}
                            >CoffeeUni</motion.h3>
                            <button
                                className="cursor-pointer p-2 rounded-md hover:bg-white/5 transition-colors duration-200"
                                onClick={e => setShowBasketMenu(false)}
                            >
                                <motion.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6 text-white text-2xl"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.55, duration: 0.4 }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18 18 6M6 6l12 12"
                                    />
                                </motion.svg>
                            </button>
                        </div>

                        {/* Carts */}
                        <RevealCarts basket={basket} hideMenu={hideMenu} />

                        <div className="pl-2 flex items-center justify-start gap-2 text-lg">
                            <h2 className="text-white">Total Price :</h2>
                            <span className="text-white"><span className="text-gray-500 text-base">$</span>{calcTotalPrice()}</span>
                        </div>
                        {basket.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.85, duration: 0.4 }}
                                className="p-2 grid grid-cols-1 xs:grid-cols-2 gap-2"
                            >

                                <button
                                    onClick={clearBasket}
                                    className="p-4 rounded-xl text-white bg-red-600 disabled:bg-red-400 hover:bg-red-700 transition-colors font-bold text-sm sm:text-base cursor-pointer"
                                    disabled={removeFlag}
                                >
                                    {removeFlag ? 'Resetting basket...' : 'Reset Basket'}
                                </button>

                                <Link
                                    href="/p-user/cart"
                                    className='p-4 rounded-xl text-white bg-green-600 hover:bg-green-700 transition-colors font-bold text-sm sm:text-base cursor-pointer text-center'
                                >Order</Link>
                                {/* <div className="flex flex-col gap-2">
                                </div> */}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* blur bg */}
                    <motion.div
                        className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm py-2 px-5 flex flex-col place-content-start gap-2 h-screen hidden w-full md:block"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 1 }}
                        transition={{
                            duration: 0.6,
                            ease: 'easeInOut'
                        }}
                        onClick={hideMenu}
                    ></motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default BasketMenu

const RevealCarts = ({ basket }) => {
    return (
        <section className="h-full w-full flex flex-col place-content-start gap-2 py-5 text-gray-500 overflow-y-auto md:px-2">
            {basket.length > 0 ? basket.map((cart, index) => (
                <CartAnimation key={index} index={index + 1}>
                    <BasketProductCart {...cart.product} size={cart.size} quantity={cart.quantity} productId={cart._id} price={cart.price} />
                </CartAnimation>
            )) : (
                <div className="w-full flex flex-col gap-5 items-center border border-[#1f1f1f] bg-[#0f0f0f] p-7 rounded-xl mt-36">
                    <h2 className="text-center text-white font-sans text-2xl ">Your Basket is Empty</h2>
                    <Link href="/Menu" className="px-4 py-2 rounded-xl cursor-pointer bg-amber-500 hover:bg-amber-600 text-[#0f0f0f] font-bold transition-colors">Order</Link>
                </div>
            )}
        </section>
    );
};

const STAGGERInitial = 0.05;

const CartAnimation = ({ children, index }) => {
    return (
        <motion.div
            className=""
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 + (index * STAGGERInitial), duration: 0.4 }}
        >
            {children}

        </motion.div>

        // <h2 className="text-center text-xl text-white font-bold">Your Basket Is Empty</h2>
    );
};

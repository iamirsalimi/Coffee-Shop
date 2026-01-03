import { motion, AnimatePresence } from 'motion/react'

import BasketProductCart from '../basketProductCart/BasketProductCart'

function BasketMenu({ showBasketMenu, setShowBasketMenu }) {
    const hideMenu = () => setShowBasketMenu(false)

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

                        {/* links */}
                        <RevealLinks hideMenu={hideMenu} />

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.85 , duration: 0.4 }}
                            className="p-2 grid grid-cols-1 xs:grid-cols-2 gap-2"
                        >
                            <button className="p-4  rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors font-bold text-sm sm:text-base cursor-pointer">Reset Basket</button>
                            <button className="p-4  rounded-xl text-white bg-sky-600 hover:bg-sky-700 transition-colors font-bold text-sm sm:text-base cursor-pointer">Order</button>
                        </motion.div>
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


const RevealLinks = () => {
    return (
        <section className="h-full w-full flex flex-col place-content-start gap-2 py-5 text-gray-500 overflow-y-auto md:px-2">
            <CartAnimation index={1}>
                <BasketProductCart />
            </CartAnimation>
            <CartAnimation index={2}>
                <BasketProductCart />
            </CartAnimation>
            <CartAnimation index={3}>
                <BasketProductCart />
            </CartAnimation>
            <CartAnimation index={4}>
                <BasketProductCart />
            </CartAnimation>
            <CartAnimation index={5}>
                <BasketProductCart />
            </CartAnimation>
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

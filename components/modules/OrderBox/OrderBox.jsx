import React, { useState } from 'react'

import { motion } from 'framer-motion'

import OrderBoxProduct from '../OrderBoxProduct/OrderBoxProduct'

function OrderBox({ _id: id, userId, isDelayed, minutesDelayed, orders, createdAt, description }) {
    const [isOpen, setIsOpen] = useState(false)

    const getMonth = date => {
        // console.log(date)
        if (!date) return ''
        let registerDate = new Date(date)

        let day = registerDate.getDate();
        let month = registerDate.getMonth() + 1;
        let year = registerDate.getFullYear();

        let hours = registerDate.getHours() < 10 ? `0${registerDate.getHours()}` : registerDate.getHours();
        let minute = registerDate.getMinutes() < 10 ? `0${registerDate.getMinutes()}` : registerDate.getMinutes();

        return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year} ${hours}:${minute}`
    }

    const getTotalItems = orders => {
        let ordersCount = orders.reduce((prev, cur) => prev + cur.quantity, 0)
        return ordersCount
    }
    const getTotalPrice = orders => {
        let totalPrice = orders.reduce((prev, cur) => prev + (cur.quantity * cur.price), 0)
        return totalPrice
    }
    

    return (
        <motion.div
            key={id}
            className="p-4 border border-[#1f1f1f] rounded-3xl bg-[#0c0c0c] space-y-0.5 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >
            <div className={`flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 text-xs text-gray-500`}>
                <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-gray-300 text-sm xs:text-base select-none">{userId.username}</span>
                    {isDelayed && (
                        <span className="text-gray-500 text-xs lg:text-sm">Delayed for {minutesDelayed} minutes</span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-1 flex-wrap select-none">
                <div className="flex items-center gap-0.5 text-xs text-nowrap">
                    <h2 className="text-gray-400">Total Items : </h2>
                    <span>{getTotalItems(orders)}</span>
                </div>
                -
                <div className="flex items-center gap-0.5 text-xs text-nowrap">
                    <h2 className="text-gray-400">Total Price : </h2>
                    <span><span className="text-gray-400 text-[0.7rem]">$</span>{getTotalPrice(orders).toFixed(2)}</span>
                </div>
                -
                <div className="flex items-center gap-0.5 text-xs text-nowrap">
                    <h2 className="text-gray-400">Date : </h2>
                    <span>{getMonth(createdAt)}</span>
                </div>
            </div>
            <p className="text-sm text-white leading-relaxed select-none">
                {description}
            </p>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                    height: isOpen ? "fit-content" : 0,
                    opacity: isOpen ? 1 : 0
                }}
                transition={{ duration: 0.8 }}
                className="mt-2 bg-black rounded-3xl border border-[#1f1f1f] p-4 flex flex-col gap-5 overflow-hidden"
            >
                {orders.map(orderedProduct => (
                    <OrderBoxProduct key={orderedProduct._id} {...orderedProduct} image={orderedProduct.product.image} title={orderedProduct.product.title} />
                ))}
            </motion.div>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="w-full mt-1 -mb-1 py-2 rounded-2xl font-bold bg-amber-500 text-black text-center cursor-pointer"
            >{isOpen ? 'show less' : 'show more'}</button>
        </motion.div>
    )
}

export default OrderBox
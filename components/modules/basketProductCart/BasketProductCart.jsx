import React, { useState } from 'react'

import { CiCoffeeCup } from "react-icons/ci";
import { TiPlus } from "react-icons/ti";
import { FaMinus } from "react-icons/fa";

function BasketProductCart() {
    const [count, setCount] = useState(1)
    const [activeSize, setActiveSize] = useState('Small')

    const sizes = ['Small', 'Medium', 'Large']

    const minusCount = () => {
        if (count <= 1) return false;

        setCount(prev => prev - 1);
    }

    const plusCount = () => {
        setCount(prev => prev + 1);
    }

    return (
        <div className="flex flex-col xs:flex-row gap-5 xs:h-60 w-full rounded-2xl border border-[#1f1f1f] bg-[#0f0f0f] p-2">
            <div className="xs:max-w-2/5 max-h-72 rounded-xl overflow-hidden w-full h-full">
                <img src="/Images/Product.jpg" className="object-cover object-center w-full h-full" alt="" />
            </div>
            <div className="h-full w-full flex flex-col justify-start gap-5">
                <div className="w-full flex flex-row items-center justify-between">
                    <h2 className="text-white xs:text-sm sm:text-base text-nowrap">Product Name :</h2>
                    <span className="text-gray-500 xs:text-sm sm:text-base">Latee Spresso</span>
                </div>

                {/* Size */}
                <div className="w-full flex flex-row items-center justify-between">
                    <h2 className="text-white text-nowrap xs:text-sm sm:text-base">Size :</h2>
                    <p className="text-gray-500 xs:text-sm sm:text-base">Medium</p>
                </div>

                {/* Quantity */}
                <div className="w-full flex flex-row items-center justify-between">
                    <h2 className="text-white text-nowrap xs:text-sm sm:text-base">Quantity :</h2>
                    <div className="flex items-center gap-2 xs:text-sm sm:text-base">
                        <button
                            onClick={minusCount}
                            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer"
                        >
                            <FaMinus className="text-white text-xl" />
                        </button>
                        <p className="text-xl text-white">{count}</p>
                        <button
                            onClick={plusCount}
                            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer"
                        >
                            <TiPlus className="text-white text-xl" />
                        </button>
                    </div>
                </div>


                <button className="mt-auto w-full py-2 rounded-xl bg-black hover:bg-red-700 transition-colors duration-200 text-white font-bold cursor-pointer">
                    Remove
                </button>
            </div>
        </div>
    )
}

export default BasketProductCart
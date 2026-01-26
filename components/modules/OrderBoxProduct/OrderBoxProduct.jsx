import Image from 'next/image'
import React from 'react'

function OrderBoxProduct({ image, title, size, quantity, price }) {
    return (
        <div className={`flex flex-col xs:flex-row gap-5 xs:h-40 w-full rounded-2xl`}>
            <div className="xs:max-w-1/3 max-h-72 xs::max-h-40 rounded-xl overflow-hidden w-full h-full">
                <Image
                    src={image}
                    className="w-full h-full object-cover object-center"
                    alt="Order Product Image"
                    width={1000}
                    height={500}
                />
            </div>
            <div className="h-full w-full flex flex-col justify-start gap-5 pr-2">
                <div className="w-full flex flex-row items-center justify-between">
                    <h2 className="text-white text-xs xs:text-sm sm:text-base text-nowrap">Product Name :</h2>
                    <span className="text-gray-500 text-xs xs:text-sm sm:text-base">{title}</span>
                </div>

                {/* Size */}
                <div className="w-full flex flex-row items-center justify-between">
                    <h2 className="text-white text-nowrap text-xs xs:text-sm sm:text-base">Size :</h2>
                    <p className="text-gray-500 text-xs xs:text-sm sm:text-base">{size}</p>
                </div>

                {/* Quantity */}
                <div className="w-full flex flex-row items-center justify-between">
                    <h2 className="text-white text-nowrap text-xs xs:text-sm sm:text-base">Quantity :</h2>
                    <p className="text-xs xs:text-sm sm:text-base text-white ">{quantity}</p>
                </div>

                {/* price */}
                <div className="w-full flex flex-row items-center justify-between">
                    <h2 className="text-white text-nowrap text-xs xs:text-sm sm:text-base">Price :</h2>
                    <p className="text-xs xs:text-sm sm:text-base text-white "><span className="text-gray-400">$</span>{(quantity * price).toFixed(2)}</p>
                </div>
            </div>
        </div>
    )
}

export default OrderBoxProduct
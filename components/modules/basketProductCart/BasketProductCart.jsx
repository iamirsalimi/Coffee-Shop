import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuth } from '@/Context/AuthContext';
import Image from 'next/image';
import { autoFetch } from '@/utils/autoFetch';
import { useBasket } from '@/Context/BasketContext';

let toastId = null;

function BasketProductCart({ title, image, quantity, size, productId, price, borderFlag }) {
    const [removeFlag, setRemoveFlag] = useState(false)
    const { setGetData } = useAuth()
    // const { setGetData } = useBasket()
    // const { setBasket } = useBasket()

    // console.log(title  , id)

    const removeProductFromBasket = async () => {
        try {
            setRemoveFlag(true)
            toastId = toast.loading('removing product from basket')

            let res = await autoFetch(`/api/user/basket/${productId}`, {
                method: "DELETE"
            })

            let resData = await res.json()
            console.log(title, productId, res, resData)

            if (res.status == 200) {
                toast.dismiss(toastId)
                toast.success('product Removed Successfully')
                // setBasket(resData.cart)
                setGetData(prev => !prev)
            }
        } catch (err) {
            toast.dismiss(toastId)
            toast.error('Unknown err in removing product')
            console.log(err)
        } finally {
            setRemoveFlag(false)
        }
    }

    return (
        <div className={`flex flex-col xs:flex-row gap-5 xs:h-60 w-full rounded-2xl bg-[#0f0f0f] p-2 ${!borderFlag ? 'border border-[#1f1f1f]' : ''} `}>
            <div className="xs:max-w-2/5 max-h-72 rounded-xl overflow-hidden w-full h-full">
                <Image
                    src={image}
                    className="w-full h-full object-cover object-center"
                    alt="basket product Image"
                    width={1000}
                    height={500}
                />
            </div>
            <div className="h-full w-full flex flex-col justify-start gap-5 pr-2">
                <div className="w-full flex flex-row items-center justify-between">
                    <h2 className="text-white xs:text-sm sm:text-base text-nowrap">Product Name :</h2>
                    <span className="text-gray-500 xs:text-sm sm:text-base">{title}</span>
                </div>

                {/* Size */}
                <div className="w-full flex flex-row items-center justify-between">
                    <h2 className="text-white text-nowrap xs:text-sm sm:text-base">Size :</h2>
                    <p className="text-gray-500 xs:text-sm sm:text-base">{size}</p>
                </div>

                {/* Quantity */}
                <div className="w-full flex flex-row items-center justify-between">
                    <h2 className="text-white text-nowrap xs:text-sm sm:text-base">Quantity :</h2>
                    <p className="text-xl xs:text-sm sm:text-base text-white ">{quantity}</p>
                </div>

                {/* price */}
                <div className="w-full flex flex-row items-center justify-between">
                    <h2 className="text-white text-nowrap xs:text-sm sm:text-base">Price :</h2>
                    <p className="text-xl xs:text-sm sm:text-base text-white "><span className="text-gray-400">$</span>{(quantity * price).toFixed(2)}</p>
                </div>

                <button
                    onClick={removeProductFromBasket}
                    className="mt-auto w-full py-2 rounded-xl bg-black disabled:bg-gray-500 hover:bg-red-700 transition-colors duration-200 text-white font-bold cursor-pointer"
                    disabled={removeFlag}
                >
                    {removeFlag ? 'Removing...' : 'Remove'}
                </button>
            </div>
        </div>
    )
}

export default BasketProductCart
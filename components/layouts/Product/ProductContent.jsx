import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useAuth } from "@/Context/AuthContext";
import { useBasket } from "@/Context/BasketContext";
import Accordion from "@/utils/Accordion";
import toast, { Toaster } from 'react-hot-toast';

import { CiCoffeeCup } from "react-icons/ci";
import { TiPlus } from "react-icons/ti";
import { FaMinus } from "react-icons/fa";
import Image from "next/image";

let toastId = null;

function ProductContent({ _id, title, description, image, smallPrice, mediumPrice, largePrice, ingredients }) {
    const [activeSize, setActiveSize] = useState('Small')
    const [count, setCount] = useState(1)
    const [isAdding, setIsAdding] = useState(false)

    const sizes = ['Small', 'Medium', 'Large']

    const { user, setGetData } = useAuth();
    const { basket } = useBasket();

    // user basket
    // console.log(user?.cart.items , basket)

    const minusCount = () => {
        if (count <= 1) return false;

        setCount(prev => prev - 1);
    }

    const plusCount = () => {
        setCount(prev => prev + 1);
    }

    const calcTotalPrice = () => {
        let total = (count * (activeSize == "Small" ? smallPrice : activeSize == 'Medium' ? mediumPrice : largePrice)).toFixed(2)
        return total
    }

    const addProductToBasket = async () => {
        setIsAdding(true)

        let newProductObj = {
            product: _id,
            size: activeSize.toUpperCase(),
            price: calcTotalPrice(),
            quantity: count
        }

        toastId = toast.loading('Adding product to basket')

        try {
            let res = await fetch(`/api/user/basket/${user._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProductObj)
            })


            let data = await res.json()
            console.log(res, data)

            if ([201, 200].includes(res.status)) {
                toast.dismiss(toastId)
                toast.success('Product has added to your basket successfully')
                setGetData(prev => !prev)
                setActiveSize('Small')
                setCount(1)
            }
        } catch (err) {
            toast.dismiss(toastId)
            toast.error(err.message)
        } finally {
            setIsAdding(false)
        }
    }

    useEffect(() => {
        console.log(basket)
    }, [basket])

    return (
        <div className="w-full h-full pb-10">
            <div className="container mx-auto w-full h-full flex flex-col lg:flex-row justify-start gap-5">
                <div className="w-full lg:w-1/2 h-[calc(100vh-10rem)] md:h-[calc(100vh-5rem)] md:max-h-[150vh] lg:h-full rounded-xl overflow-hidden">
                    <Image
                        src={image}
                        className="object-cover object-center w-full h-full"
                        alt="product image"
                        width={1000}
                        height={500}
                        quality={100}
                        priority={true}
                    />
                </div>

                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-5 lg:gap-2 px-5 lg:px-0 mt-5">
                    <h2 className="text-white font-sans font-bold text-3xl md:text-5xl">{title}</h2>
                    {/* <p className="text-gray-400 font-semibold text-xl">$25.99</p> */}

                    {/* description */}
                    <Accordion title="Description" defaultOpenValue={true}>
                        <p className="text-gray-400 text-center lg:text-justify">
                            {description}
                        </p>
                    </Accordion>

                    {/* ingredients */}
                    <div className="flex items-center gap-2">
                        <h2 className="text-white font-bold text-nowrap">Ingredients : </h2>
                        <ul className="flex items-start gap-2 h-full flex-wrap select-none">
                            {ingredients.map((ingredient, index) => (
                                <li key={index} className="px-2 py-1 text-xs rounded-full text-black font-semibold bg-white">{ingredient}</li>
                            ))}
                        </ul>
                    </div>

                    {/* product Sizes */}
                    <div className="w-full p-4 border border-[#1f1f1f] rounded-2xl space-y-4 bg-[#0f0f0f]">
                        <h2 className="text-lg font-semibold text-white">
                            Price Per Size
                        </h2>

                        <ul className="flex flex-col gap-2 text-sm text-gray-400 list-disc">
                            <li className="w-full flex items-center justify-between">
                                <span>Small : </span>
                                <span>${smallPrice.toFixed(2)}</span>
                            </li>
                            <li className="w-full flex items-center justify-between">
                                <span>Medium : </span>
                                <span>${mediumPrice.toFixed(2)}</span>
                            </li>
                            <li className="w-full flex items-center justify-between">
                                <span>Large : </span>
                                <span>${largePrice.toFixed(2)}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center lg:items-start gap-5 mt-2">
                        <h2 className="text-white font-sans font-bold text-2xl">Drink Size : </h2>

                        <div className="flex items-center gap-5">
                            {sizes.map((size, index) => (
                                <div className="flex flex-col items-center gap-2 product-size">
                                    <input type="radio" id={size} name="productSize" className="hidden" checked={activeSize == size} data-size={size} onChange={e => setActiveSize(e.target.dataset.size)} />
                                    <label htmlFor={size} className="w-16 h-16 rounded-full border border-[#1f1f1f] bg-[#0f0f0f] flex items-center justify-center cursor-pointer transition-all duration-200">
                                        <CiCoffeeCup className={`text-white text-${(index + 1) > 1 ? index + 1 : ''}xl`} />
                                    </label>
                                    <p className="text-white transition-all duration-200">{size}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Count */}
                    <div className="w-full p-2 lg:p-2 lg:rounded-full rounded-4xl flex flex-col lg:flex-row items-center gap-3 lg:gap-2 border border-[#1f1f1f] bg-[#0f0f0f] mt-5">
                        <div className="flex flex-col xs:flex-row items-center justify-between">
                            {/* count */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={minusCount}
                                    className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black text-white flex items-center justify-center cursor-pointer"
                                >
                                    <FaMinus className="text-white text-xl md:text-2xl" />
                                </button>
                                <p className="text-4xl text-white">{count}</p>
                                <button
                                    onClick={plusCount}
                                    className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black text-white flex items-center justify-center cursor-pointer"
                                >
                                    <TiPlus className="text-white text-xl md:text-2xl" />
                                </button>
                            </div>
                            {/* price */}
                            <div className="flex items-center gap-2 p-2 text-nowrap">
                                <h2 className="text-white text-xl md:text-2xl font-bold">Price :</h2>
                                <span className="text-gray-500 text-xl md:text-2xl">$<span className="text-white">{calcTotalPrice()}</span></span>
                            </div>
                        </div>
                        {/* add button */}
                        <button
                            onClick={addProductToBasket}
                            className="w-full h-16 rounded-3xl lg:rounded-full bg-green-500 disabled:bg-green-300 text-white font-bold flex items-center justify-center cursor-pointer hover:bg-green-600 transition-all duration-200 lg:text-sm xl:text-base"
                            disabled={!user && isAdding}
                        >
                            {isAdding ? 'ADDING...' : 'ADD TO ORDERS'}
                        </button>
                    </div>
                </div>
            </div>
            <Toaster
                position="top-left"
                reverseOrder={false}
            />
        </div>
    )
}

export default ProductContent

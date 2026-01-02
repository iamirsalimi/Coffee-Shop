import { useState } from "react";
import { motion } from "framer-motion";

import { CiCoffeeCup } from "react-icons/ci";
import { TiPlus } from "react-icons/ti";
import { FaMinus } from "react-icons/fa";

import Accordion from "@/utils/Accordion";

function ProductContent() {
    const [activeSize, setActiveSize] = useState('Small')
    const [count, setCount] = useState(1)

    const sizes = ['Small', 'Medium', 'Large']

    const minusCount = () => {
        if (count <= 1) return false;

        setCount(prev => prev - 1);
    }

    const plusCount = () => {
        setCount(prev => prev + 1);
    }

    return (
        <div className="w-full h-full pb-10">
            <div className="container mx-auto w-full h-full flex flex-col lg:flex-row justify-start gap-5">
                <div className="w-full lg:w-1/2 h-[calc(100vh-10rem)] md:h-[calc(100vh-5rem)] lg:h-full rounded-xl overflow-hidden">
                    <img src="/Images/Product.jpg" alt="" className="w-full h-full object-cover object-center" />
                </div>

                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-5 lg:gap-2 px-5 lg:px-0 mt-5">
                    <h2 className="text-white font-sans font-bold text-3xl md:text-5xl">Latee Coffee</h2>
                    <p className="text-gray-400 font-semibold text-xl">$25.99</p>

                    {/* description */}
                    <Accordion title="Description" defaultOpenValue={true}>
                        <p className="text-gray-400 text-center lg:text-justify">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores mollitia culpa eum explicabo reprehenderit accusamus sequi cumque fuga placeat illo.
                        </p>
                    </Accordion>

                    {/* ingredients */}
                    <div className="flex items-center gap-2">
                        <h2 className="text-white font-bold text-nowrap">Ingredients : </h2>
                        <ul className="flex items-start gap-2 h-full flex-wrap select-none">
                            <li className="px-2 py-1 text-xs rounded-full text-black font-semibold bg-white">Milk</li>
                            <li className="px-2 py-1 text-xs rounded-full text-black font-semibold bg-white">Sugar</li>
                            <li className="px-2 py-1 text-xs rounded-full text-black font-semibold bg-white">Espresso</li>
                            <li className="px-2 py-1 text-xs rounded-full text-black font-semibold bg-white">Cookie</li>
                        </ul>
                    </div>

                    {/* product Sizes */}
                    <div className="flex flex-col items-center lg:items-start gap-5 mt-5">
                        <h2 className="text-white font-sans font-bold text-2xl">Drink Size : </h2>

                        <div className="flex items-center gap-5">
                            {sizes.map((size, index) => (
                                <div className="flex flex-col items-center gap-2 product-size">
                                    <input type="radio" id={size} name="productSize" className="hidden" checked={activeSize == size} data-size={size} onChange={e => setActiveSize(e.target.dataset.size)} />
                                    <label htmlFor={size} className="w-16 h-16 rounded-full bg-[#171717] flex items-center justify-center cursor-pointer transition-all duration-200">
                                        <CiCoffeeCup className={`text-white text-${(index + 1) > 1 ? index + 1 : ''}xl`} />
                                    </label>
                                    <p className="text-white transition-all duration-200">{size}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Count */}
                    <div className="w-full p-2 lg:p-2 lg:rounded-full rounded-4xl flex flex-col lg:flex-row items-center gap-3 lg:gap-2 bg-[#171717] mt-auto">
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
                                <span className="text-gray-500 text-xl md:text-2xl">$<span className="text-white">25.99</span></span>
                            </div>
                        </div>
                        {/* add button */}
                        <button className="w-full h-16 rounded-3xl lg:rounded-full bg-green-500 text-white font-bold flex items-center justify-center cursor-pointer hover:bg-green-600 transition-all duration-200 lg:text-sm xl:text-base">
                            ADD TO ORDERS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductContent

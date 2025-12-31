import React from 'react'

function OurServices() {
    return (
        <div className="py-16 w-full min-h-screen bg-black">
            <div className="container mx-auto px-5 py-10 w-full h-full flex flex-col gap-8 items-start justify-start">
                <Title title="Our Services" />
                <p className="text-white text-lg text-center sm:text-justify">More than just coffee — we create a complete café experience.</p>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-7">
                    <div className="flex flex-col gap-4 items-start">
                        <h2 className="menu-title after:bg-red-500">Hot</h2>
                        <ProductCard />
                        <ProductCard />
                    </div>
                    <div className="flex flex-col gap-4 items-start">
                        <h2 className="menu-title after:bg-blue-500">Cold</h2>
                        <ProductCard />
                        <ProductCard />
                    </div>
                </div>
                <button className="mx-auto w-fit px-4 py-2 font-bold font-sans bg-white text-black rounded-lg hover:bg-black border border-white hover:text-white transition-colors duration-200 cursor-pointer">View All Products</button>
            </div>
        </div>
    )
}

export default OurServices

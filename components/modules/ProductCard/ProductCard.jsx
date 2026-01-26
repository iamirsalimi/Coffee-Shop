import Image from "next/image";
import Link from "next/link";

import { IoHeartOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

function ProductCard({ title, summary, smallPrice, image, slug, comments }) {
    // console.log(comments)

    let ratingAvg = comments.length > 0 ?(comments?.reduce((prev, cur) => prev + cur.rating, 0) / comments.length).toFixed(1) : 0 // avg rating to show the product avg
    return (
        <div className="w-full min-h-96 max-h-96 rounded-lg overflow-hidden relative">
            <Image 
                src={image} 
                className="w-full h-full object-cover object-center" 
                alt="product Image"
                width={1000}
                height={500}
            />

            <div className="w-full rounded-none min-h-1/4 sm:min-h-1/4 px-2 py-1 h-fit glass-effect backdrop-blur-xl absolute bottom-0 flex flex-col gap-1">
                <div className="w-full flex items-center justify-between">
                    <h3 className="text-white font-bold text-base xs:text-lg font-sans">{title}</h3>

                    <div className="inline-flex items-center justify-center gap-0.5 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-yellow-500 fill-yellow-500 w-4 h-4 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        <div className="text-white text-sm xs:text-base font-semibold">{ratingAvg}</div>
                    </div>
                </div>

                <div className="w-full flex items-center justify-between">
                    <p className="text-gray-400 text-xs xs:text-sm line-clamp-1">{summary}</p>
                    <span className="text-white text-sm font-bold"><span className="text-xs text-gray-500">$</span>{smallPrice}</span>
                </div>

                <Link href={`/Product/${slug}`} className="underline font-sans text-sm font-semibold">Buy Now</Link>
            </div>
            {/* <div className="absolute top-1 right-1 glass-effect p-1 rounded-full cursor-pointer hover:scale-105 transition-all">
                <IoHeartOutline className="text-white w-6 h-6" />
            </div> */}
        </div>
    )
}

export default ProductCard

import Link from "next/link"

import ProductContent from "@/components/layouts/Product/ProductContent"
import RatingAndComments from "@/components/layouts/Product/RatingAndComments"

import { FaAngleRight } from "react-icons/fa6";

function ProductPage() {
    return (
        <div className="w-full h-full mt-20 lg:mt-20 px-5 xs:px-0 ">
            <ul className="container mx-auto flex items-center justify-start gap-0.5 text-sm mb-5">
                <li className="text-white">
                    <Link href="/">Home</Link>
                </li>
                <FaAngleRight className="text-gray-500 text-sm" />
                <li className="text-gray-500">Product</li>
            </ul>
            <ProductContent />
            <RatingAndComments />
        </div>
    )
}

ProductPage.paddingFlag = true

export default ProductPage
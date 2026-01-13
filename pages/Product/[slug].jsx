import Link from "next/link"

import ProductContent from "@/components/layouts/Product/ProductContent"
import RatingAndComments from "@/components/layouts/Product/RatingAndComments"
import connectToDB from "@/src/configs/db";
import productsModel from "@/src/Models/Product";

import { FaAngleRight } from "react-icons/fa6";

export const getStaticPaths = async () => {
    await connectToDB();

    const products = await productsModel.find({});

    const paths = products.map((product) => ({
        params: { slug: product.slug }
    }))

    // console.log(products.paths)

    return {
        paths,
        fallback: "blocking",
    }
}



export const getStaticProps = async (context) => {
    try {
        let { slug } = context.params
        connectToDB()

        let product = await productsModel.findOne({ slug }).populate({
            path: "comments",
            options: { sort: { createdAt: -1 } },
        });

        if (!product) {
            return {
                redirect: { destination: '/' }
            }
        }

        // console.log(product)

        return {
            props: {
                product: JSON.parse(JSON.stringify(product))
            },
            revalidate: 60 * 60 * 12 // 12H 
        }


    } catch (err) {
        return {
            props: { err: "there is an unknown err" }
        }
    }
}

function ProductPage({ product }) {
    // console.log(product)
    return (
        <div className="w-full h-full mt-20 lg:mt-20 px-5 xs:px-0 ">
            <ul className="container mx-auto flex items-center justify-start gap-0.5 text-sm mb-5">
                <li className="text-white">
                    <Link href="/">Home</Link>
                </li>
                <FaAngleRight className="text-gray-500 text-sm" />
                <li className="text-gray-500">Product</li>
            </ul>
            <ProductContent {...product} />
            <RatingAndComments {...product} />
        </div>
    )
}

ProductPage.paddingFlag = true

export default ProductPage
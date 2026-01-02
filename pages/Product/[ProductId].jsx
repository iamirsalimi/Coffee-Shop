import ProductContent from "@/components/layouts/Product/ProductContent"
import RatingAndComments from "@/components/layouts/Product/RatingAndComments"

function ProductPage() {
    return (
        <div className="w-full h-full mt-15 lg:mt-20 px-5 xs:px-0 ">
            <ProductContent />
            <RatingAndComments />
        </div>
    )
}

ProductPage.paddingFlag = true

export default ProductPage
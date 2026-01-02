import ProductContent from "@/components/layouts/Product/ProductContent"

function ProductPage() {
    return (
        <div className="w-full h-full mt-15 lg:mt-20 pb-20 px-5 xs:px-0">
            <ProductContent />
        </div>
    )
}

ProductPage.paddingFlag = true

export default ProductPage
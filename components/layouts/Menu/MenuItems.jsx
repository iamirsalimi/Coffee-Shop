import Title from '@/components/modules/Title/Title'
import ProductCard from '@/components/modules/ProductCard/ProductCard'

function MenuItems() {
    return (
        <div className="py-16 w-full min-h-screen bg-black">
            <div className="container mx-auto px-5 py-10 w-full h-full flex flex-col gap-8 items-start justify-start">
                <Title title="Our Menu" />
                <p className="text-white text-lg text-center sm:text-justify">A carefully curated menu inspired by everyday moments. Crafted to be enjoyed slowly and remembered.</p>
                <div className="w-full flex flex-col gap-7">
                    <div className="flex flex-col gap-4 items-start">
                        <h2 className="menu-title after:bg-red-500">Hot</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 items-start">
                        <h2 className="menu-title after:bg-sky-500">Cold</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 items-start">
                        <h2 className="menu-title after:bg-pink-500">Especial</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MenuItems
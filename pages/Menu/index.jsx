import Header from '@/components/layouts/Menu/Header'
import MenuItems from '@/components/layouts/Menu/MenuItems'
import React from 'react'
import connectToDB from "@/src/configs/db";
import productsModel from "@/src/Models/Product";

export const getStaticProps = async () => {
  try {
    connectToDB()

    let products = await productsModel.find({}).populate({
      path: "comments",
      // match: { isAvailable: true },
      options: { sort: { createdAt: -1 } },
    });

    // console.log(products)

    return {
      props: {
        products: JSON.parse(JSON.stringify(products))
      },
      revalidate: 60 * 60 * 12 // 12H 
    }


  } catch (err) {
    return {
      props: { err: "there is an unknown err" }
    }
  }
}

function Menu({ products }) {
  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <MenuItems products={products} />
    </div>
  )
}

export default Menu
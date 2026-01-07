import Header from '@/components/layouts/Home/Header';
import FeaturedMenu from '@/components/layouts/Home/FeaturedMenu';
import MenuTicker from "@/components/layouts/Home/MenuTicker"
import OurServices from "@/components/layouts/Home/OurServices"
import WhatOurCustomersSay from '@/components/layouts/Home/WhatOurCustomersSay'
import connectToDB from "@/src/configs/db";
import productsModel from "@/src/Models/Product";
import commentsModel from "@/src/Models/Comment";

export const getStaticProps = async () => {
  try {
    connectToDB()

    let products = await productsModel.find({}).populate({
      path: "comments",
      // match: { isAvailable: true },
      options: { sort: { createdAt: -1 } },
    });

    let comments = await commentsModel.find({})

    // console.log(products)

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        comments: JSON.parse(JSON.stringify(comments))

      },
      revalidate: 60 * 60 * 12 // 12H 
    }


  } catch (err) {
    return {
      props: { err: "there is an unknown err" }
    }
  }
}

export default function Home({ products, comments }) {
  //  console.log(products)
  return (
    <div className="relative w-full min-h-screen h-fit overflow-hidden">
      <Header />
      <FeaturedMenu products={products} />
      <MenuTicker />
      <OurServices />
      <WhatOurCustomersSay comments={comments} />
    </div>
  );
}

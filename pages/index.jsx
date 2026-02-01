import Head from 'next/head';

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

    let comments = await commentsModel.find({}).populate('productId')

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
  console.log(comments)
  return (
    <div className="relative w-full min-h-screen h-fit overflow-hidden">
      <Head>
        <title>Coffee Uni | Home</title>
        <meta name="description" content="Our journey began with a simple idea: to create a place where great coffee meets a welcoming atmosphere. From the very beginning, we wanted more than just a café. We imagined a space where people could slow down, feel comfortable, and truly enjoy the moment. Every detail matters to us — from carefully selected beans to thoughtful preparation and warm service. What started as a personal passion has grown into a community built around quality, care, and consistency. A place where every cup tells a story, and every visit feels familiar." />
      </Head>
      <Header />
      <FeaturedMenu products={products.filter(product => product.isAvailable)} />
      <MenuTicker />
      <OurServices />
      <WhatOurCustomersSay comments={comments} />
    </div>
  );
}

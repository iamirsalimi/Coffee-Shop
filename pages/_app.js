import { useState } from "react";

import Navbar from "@/components/modules/Navbar/Navbar";
import Menu from "@/components/modules/Menu/Menu";
import BasketMenu from "@/components/modules/BasketMenu/BasketMenu";
import Footer from '@/components/modules/Footer/Footer'

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showBasketMenu, setShowBasketMenu] = useState(true);

  // If page says: noLayout = true
  if (Component.noLayout) {
    return (
      <Component {...pageProps} />
    )
  }
  console.log(Component.paddingFlag)

  return (
    <>
      <Navbar setShowMenu={setShowMenu} setShowBasketMenu={setShowBasketMenu} paddingFlag={Component?.paddingFlag} />
      <Component {...pageProps} />
      <Footer />
      {/* menus */}
      <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
      <BasketMenu showBasketMenu={showBasketMenu} setShowBasketMenu={setShowBasketMenu} />
    </>
  );
}

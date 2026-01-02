import { useState } from "react";

import Navbar from "@/components/modules/Navbar/Navbar";
import Menu from "@/components/modules/Menu/Menu";
import Footer from '@/components/modules/Footer/Footer'

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const [showMenu, setShowMenu] = useState(false);

  // If page says: noLayout = true
  if (Component.noLayout) {
    return (
      <Component {...pageProps} />
    )
  }
  console.log(Component.paddingFlag)

  return (
    <>
      <Navbar setShowMenu={setShowMenu} paddingFlag={Component?.paddingFlag} />
      <Component {...pageProps} />
      <Footer />
      <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
    </>
  );
}

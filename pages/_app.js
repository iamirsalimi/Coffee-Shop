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

  return (
    <>
      <Navbar setShowMenu={setShowMenu} />
      <Component {...pageProps} />
      <Footer />
      <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
    </>
  );
}

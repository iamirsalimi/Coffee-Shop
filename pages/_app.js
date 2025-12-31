import Navbar from "@/components/modules/Navbar/Navbar";
import Menu from "@/components/modules/Menu/Menu";
import "@/styles/globals.css";
import { useState } from "react";

export default function App({ Component, pageProps }) {
    const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <Navbar setShowMenu={setShowMenu} />
      <Component {...pageProps} />
      <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
    </>
  )
}

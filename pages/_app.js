import Navbar from "@/components/modules/Navbar/Navbar";
import Menu from "@/components/modules/Menu/Menu";
import "@/styles/globals.css";
import { useState } from "react";

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
      <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
    </>
  );
}

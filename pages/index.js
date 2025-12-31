import Header from '@/components/layouts/Home/Header';
import FeaturedMenu from '@/components/layouts/Home/FeaturedMenu';
import MenuTicker from "@/components/layouts/Home/MenuTicker"
import OurServices from "@/components/layouts/Home/OurServices"
import Footer from '@/components/modules/Footer/Footer'

export default function Home() {
  return (
    <div className="relative w-full min-h-screen h-fit overflow-hidden">
      <Header />
      <FeaturedMenu />
      <MenuTicker />
      <OurServices />
      <div className="h-screen bg-black"></div>
      <Footer />
    </div>
  );
}

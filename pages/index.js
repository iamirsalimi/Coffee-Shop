import Header from '@/components/layouts/Home/Header';
import FeaturedMenu from '@/components/layouts/Home/FeaturedMenu';

export default function Home() {
  return (
    <div className="relative w-full min-h-screen h-fit overflow-hidden">
      <Header />
      <FeaturedMenu />
      <div className="h-screen bg-black"></div>
    </div>
  );
}

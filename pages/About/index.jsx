import Header from "@/components/layouts/About/Header"
import OurJourney from "@/components/layouts/About/OurJourney"
import OurSpace from '@/components/layouts/About/OurSpace'

function About() {
  return (
    <div className="w-full flex flex-col">
        <Header />
        <OurJourney />
        <OurSpace />
    </div>
  )
}

export default About

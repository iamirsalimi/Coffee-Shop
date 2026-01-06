import Header from '@/components/layouts/Contact/Header'
import ContactForm from '@/components/layouts/Contact/ContactForm'
import { Toaster } from 'react-hot-toast';

export const getStaticProps = () => {
  return {
    props : {

    } 
  }
}

function Contact() {
  return (
    <div className="flex flex-col w-full h-full bg-black">
        <Header />
        <ContactForm />
        <Toaster
                position="top-left"
                reverseOrder={false}
              />
    </div>
  )
}

export default Contact
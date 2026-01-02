import Header from '@/components/layouts/Contact/Header'
import ContactForm from '@/components/layouts/Contact/ContactForm'

function Contact() {
  return (
    <div className="flex flex-col w-full h-full bg-black">
        <Header />
        <ContactForm />
    </div>
  )
}

export default Contact
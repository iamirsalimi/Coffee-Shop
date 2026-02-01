import { motion } from "framer-motion"

import Title from "@/components/modules/Title/Title"

import React from 'react'
import Image from "next/image"

function OurSpace() {
    return (
        <div className="py-10 w-full min-h-screen">
            <div className="container mx-auto px-5 pt-10 w-full h-full flex flex-col gap-8 items-start justify-start">
                <Title title="Our Space & Experience" />
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-white text-lg text-center md:text-justify"
                >
                    We designed our space to feel warm, calm, and inviting.
                    Whether you’re here to work, meet friends, or enjoy a quiet moment, our café is built to support every kind of visit. Comfortable seating, soft lighting, and thoughtful details shape the experience
                </motion.p>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="rounded-3xl w-full h-full overflow-hidden"
                    >
                        <Image
                            src="/Images/About-3.jpg"
                            className="object-cover object-center w-full h-full"
                            alt="Our Space image"
                            width={1000}
                            height={500}
                            quality={100}
                            priority={true}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="rounded-3xl w-full h-full overflow-hidden"
                    >
                        <Image
                            src="/Images/About-4.jpg"
                            className="object-cover object-center w-full h-full"
                            alt="Our Space image"
                            width={1000}
                            height={500}
                            quality={100}
                            priority={true}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="rounded-3xl w-full h-full overflow-hidden"
                    >
                        <Image
                            src="/Images/About-5.jpg"
                            className="object-cover object-center w-full h-full"
                            alt="Our Space image"
                            width={1000}
                            height={500}
                            quality={100}
                            priority={true}
                        />
                    </motion.div>
                </div>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-white text-lg w-full text-center"
                >
                    More than a café - a space made for people.
                </motion.p>
            </div>
        </div>
    )
}

export default OurSpace

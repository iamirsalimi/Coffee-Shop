import React, { useState } from 'react'
import { motion } from 'framer-motion'

function Accordion({ title, defaultOpenValue = false, children }) {
    const [isOpen, setIsOpen] = useState(defaultOpenValue)

    return (
        <motion.div
            key="Ingredients"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsOpen(prev => !prev)}
            className="border border-gray-500 w-full h-fit rounded-xl p-2 space-y-3 select-none"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-white font-sans font-bold text-xl">{title} : </h2>
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    initial={{ rotate: 0 }}
                    animate={{
                        rotate: !isOpen ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-white w-7 h-7"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </motion.svg>
            </div>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                    height: isOpen ? "fit-content" : 0,
                    opacity: isOpen ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </motion.div>
    )
}


export default Accordion
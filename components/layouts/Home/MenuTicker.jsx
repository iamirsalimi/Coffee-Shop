import { motion } from 'motion/react';
import { CiCoffeeCup } from "react-icons/ci";
import { PiCoffeeBeanFill } from "react-icons/pi";

export default function MenuTicker() {
    const products = [
        "Espresso",
        "Caffè Latte",
        "Cappuccino",
        "Americano",
        "Mocha",
        "Flat White",
        "Iced Coffee",
        "Cold Brew",
        "Caramel Latte",
        "Vanilla Latte",
    ];

    return (
        <div className="w-full overflow-hidden bg-[--foreground] py-4">
            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                }}
            >
                {[...products, ...products].map((item, index) => (
                    <div className="group inline-flex items-center justify-center gap-1">
                        <span
                            key={index}
                            className="mx-4 sm:mx-8 text-base sm:text-lg font-medium text-white"
                        >
                            {item}
                        </span>
                        <CiCoffeeCup className="group-even:hidden inline text-white text-lg sm:text-xl" />
                        <PiCoffeeBeanFill className="group-odd:hidden inline text-white text-lg sm:text-xl" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

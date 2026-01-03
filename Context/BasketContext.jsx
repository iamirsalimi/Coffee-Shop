import { createContext, useContext, useState } from 'react'

const BasketContext = createContext(null)

export default basketContextProvider = ({ children }) => {
    const [basket, setBasket] = useState([])

    const addToBasket = (product) => {
        setBasket(prev => {
            const exists = basket.find((item => item.id == product.id))

            if (exists) {
                return prev.map(item => item.id == product.id ? ({ ...item, quantity: item.quantity + 1 }) : item)
            }

            return [...prev, { ...product, quantity: 1 }]
        })
    }

    const removeFromBasket = () => {
        setBasket(prev => prev.filter(prevBasket => prevBasket.id != product.id))
    }

    const changeQuantity = (id, amount) => {
        setBasket((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: quantity > 0 ? item.quantity + amount : item.quantity - amount }
                    : item
            )
        )
    }

    const totalPrice = cart.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
    )

    return (
        <BasketContext.Provider
            value={{
                basket,
                setBasket,
                totalPrice,
                addToBasket,
                removeFromBasket,
                changeQuantity
            }}
        >
            {children}
        </BasketContext.Provider >
    )
} 

export const useBasket = () => useContext(BasketContext)
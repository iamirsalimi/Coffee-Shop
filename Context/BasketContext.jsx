import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const BasketContext = createContext(null)

export const BasketProvider = ({ children }) => {
    const [getData, setGetData] = useState(false)
    const { user } = useAuth()

    const [basket, setBasket] = useState(() => {
        if (user) return user?.cart.items

        return []
    })

    const addToBasket = (product) => {
        setBasket(prev => {
            const exists = basket.find((item => item.id == product.id && item.size == product.size))

            if (exists) {
                return prev.map(item => item.id == product.id && product.size == item.size ? ({ ...item, quantity: product.quantity }) : item)
            }

            return [...prev, { ...product, quantity: 1 }]
        })
    }

    // const removeFromBasket = product => {
    //     setBasket(prev => prev.filter(prevBasket => prevBasket.id != product._id))
    // }

    useEffect(() => {
        const getBasket = async () => {
            try {
                let res = await fetch(`/api/user/basket/${user._id}`)
                let data = await res.json()
                if (res.status == 200) {
                    setBasket(data.cart)
                }
            } catch (err) {
                console.log(err)
            }
        }

        if (user) {
            getBasket()
        }
    }, [getData, user])

    // const changeQuantity = (id, amount) => {
    //     setBasket((prev) =>
    //         prev.map((item) =>
    //             item.id === id
    //                 ? { ...item, quantity: quantity > 0 ? item.quantity + amount : item.quantity - amount }
    //                 : item
    //         )
    //     )
    // }

    // const totalPrice = basket?.reduce(
    //     (sum, item) => sum + (item.price * item.quantity),
    //     0
    // )

    return (
        <BasketContext.Provider
            value={{
                basket,
                setBasket,
                // totalPrice,
                addToBasket,
                // removeFromBasket,
                // changeQuantity,
                setGetData
            }}
        >
            {children}
        </BasketContext.Provider >
    )
}

export const useBasket = () => useContext(BasketContext)
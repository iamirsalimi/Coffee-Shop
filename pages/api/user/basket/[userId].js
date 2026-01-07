import connectToDB from "@/src/configs/db";
import User from "@/src/Models/User";
import { verifyRefreshToken } from '@/src/utils/auth'

export default async function handler(req, res) {
    if (!["PUT", 'DELETE', "GET"].includes(req.method)) {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        await connectToDB();

        const { userId } = req.query;
        console.log('userId : ', userId)
        switch (req.method) {
            case "GET": {
                const user = await User.findById(userId).populate({
                    path: "cart.items.product",
                })
                return res.json({
                    cart: user.cart.items,
                });
            }

            case "PUT": {
                const { product, size, quantity } = req.body;

                // console.log(product)
                if (quantity < 1) {
                    return res.status(400).json({ message: "Invalid quantity" });
                }

                const user = await User.findById(userId);
                // console.log('user : ', user)

                const item = user.cart.items.find(
                    (item) =>
                        item.product.toString() === product &&
                        item.size === size
                );
                // console.log('founded basket item : ', item)

                if (!item) {
                    // console.log('added to basket : ', item)
                    user.cart.items.push({
                        product,
                        size,
                        quantity,
                    });
                    await user.save();
                    return res.status(201).json({ message: "Added to Cart Successfully" });
                }

                // console.log('updated basket : ', item)
                const usersArray = user.cart.items.map(cart => {
                    if (cart.product == product && cart.size == size) {
                        cart.quantity = quantity;
                    }
                    return cart
                })

                // console.log(usersArray , user , product)

                await user.save();

                return res.status(200).json({
                    message: "Cart updated",
                    cart: user.cart,
                });

            }

            case "DELETE": {
                let { refreshToken } = req.cookies
                // console.log('refresh Token : ', refreshToken)

                if (!refreshToken) return res.status(401).json({ message: "you're not logged in !!" }) // unauthorized

                const tokenPayload = verifyRefreshToken(refreshToken)
                // console.log('token payload : ', tokenPayload)

                if (!tokenPayload) return res.status(422).json({ message: "token is not valid !!" })

                let user = await User.findOne({ _id: tokenPayload.userId }, '-__v -password -updatedAt').populate({
                    path: "cart.items.product",
                })

                if (userId == -1) {
                    user.cart.items = []
                } else {
                    user.cart.items = user.cart.items.filter((item) => item.id != userId)
                }

                await user.save();

                return res.status(200).json({
                    message: "Item removed from cart",
                    cart: user.cart
                });
            }
        }
    } catch (err) {
        console.log('error : ', err)
        return res.status(500).json({
            message: "Failed to add to cart",
            error: err
        })
    }
}
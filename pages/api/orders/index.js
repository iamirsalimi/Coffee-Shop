import connectToDB from "@/src/configs/db";
import Order from "@/src/Models/Order";
import { isValidObjectId } from "mongoose";
import { verifyAccessToken, requireRole } from "@/src/utils/auth";
import { authMiddleware } from "@/src/middlewares/authmiddleware";
import { middleware } from "@/src/utils/middleware";

export default async function handler(req, res) {
    if (!["POST", "GET"].includes(req.method)) return res.status(405).json({ message: "Method not allowed" })

    try {
        await connectToDB();

        let reqAuthorization = req.headers.authorization;
        await middleware(reqAuthorization, res, authMiddleware);

        const user = verifyAccessToken(req, res);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        switch (req.method) {
            case "GET": {
                // if user wasn't admin it will throw err 
                requireRole(user, ["ADMIN"]);
                const orders = await Order.find({}).populate("userId").sort({ createdAt: -1 })

                return res.status(200).json(orders);
            }

            case "POST": {
                const { userId, orders, totalPrice, description, isDelayed, minutesDelayed } = req.body;

                // if user wasn't user it will throw err 
                requireRole(user, ["USER"]);

                if (!userId || !orders || !totalPrice || !description) {
                    return res.status(400).json({
                        message: "All fields are required"
                    });
                }

                if (!isValidObjectId(userId)) {
                    return res.status(400).json({
                        message: "Invalid product ID",
                    });
                }

                if (isDelayed && minutesDelayed < 5 || minutesDelayed > 90) {
                    return res.status(400).json({
                        message: "minutes delayed must be between 5 and 90",
                    });
                }

                const order = await Order.create({
                    userId,
                    orders,
                    totalPrice,
                    description,
                    isDelayed,
                    minutesDelayed
                });

                return res.status(201).json({
                    message: "order submitted successfully , you can get your order by going to coffee shop",
                    order
                });
            }
        }

    } catch (err) {
        console.error("CONTACT GET ERROR:", err);
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

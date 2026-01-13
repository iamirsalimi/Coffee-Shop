import connectToDB from "@/src/configs/db";
import Order from "@/src/Models/Order";
import { isValidObjectId } from "mongoose";
import { verifyAccessToken, requireRole } from "@/src/utils/auth";

export default async function handler(req, res) {
    if (!["GET"].includes(req.method)) return res.status(405).json({ message: "Method not allowed" })

    try {
        const { userId } = req.query;

        const user = verifyAccessToken(req, res);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // if user wasn't admin it will throw err 
        requireRole(user, ["ADMIN"]);

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID",
            });
        }

        await connectToDB();

        switch (req.method) {
            case "GET": {
                const order = await Order.find({ userId }).populate("userId");

                if (!order) {
                    return res.status(404).json({
                        message: "order not found",
                    });
                }

                return res.status(200).json(order);
            }

            // case "PATCH": {
            //     const { description } = req.body;

            //     const updated = await Order.findByIdAndUpdate(
            //         userId,
            //         { description },
            //         { new: true }
            //     );

            //     if (!updated) {
            //         return res.status(404).json({
            //             message: "Order not found",
            //         });
            //     }

            //     return res.status(200).json(updated);
            // }
        }

    } catch (err) {
        console.error("CONTACT GET ERROR:", err);
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}
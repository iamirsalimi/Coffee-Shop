import connectToDB from "@/src/configs/db";
import Comment from "@/src/Models/Comment";
import { isValidObjectId } from "mongoose";
import { verifyAccessToken, requireRole } from "@/src/utils/auth";
import { authMiddleware } from "@/src/middlewares/authmiddleware";
import { middleware } from "@/src/utils/middleware";

export default async function handler(req, res) {
    if (!["POST", "GET"].includes(req.method)) return res.status(405).json({ message: "Method not allowed" })

    try {
        await connectToDB();

        let reqAuthorization = req.headers.authorization;
        console.log(reqAuthorization)
        await middleware(reqAuthorization, res, authMiddleware);

        const user = verifyAccessToken(req, res);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        switch (req.method) {
            case "GET": {
                // if user wasn't admin it will throw err 
                requireRole(user, ["ADMIN"]);
                const comments = await Comment.find().populate("productId").sort({ createdAt: -1 })

                return res.status(200).json(comments);
            }

            case "POST": {
                const { productId, username, rating, commentText } = req.body;

                // if user wasn't user it will throw err 
                requireRole(user, ["USER"]);

                if (!productId || !username || !rating || !commentText) {
                    return res.status(400).json({
                        message: "All fields are required",
                    });
                }

                if (!isValidObjectId(productId)) {
                    return res.status(400).json({
                        message: "Invalid product ID",
                    });
                }

                if (rating < 1 || rating > 5) {
                    return res.status(400).json({
                        message: "Rating must be between 1 and 5",
                    });
                }

                const comment = await Comment.create({
                    productId,
                    username,
                    rating,
                    commentText,
                });

                return res.status(201).json({
                    message: "Comment submitted and awaiting approval",
                    comment
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

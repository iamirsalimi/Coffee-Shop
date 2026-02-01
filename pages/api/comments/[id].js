import connectToDB from "@/src/configs/db";
import Comment from "@/src/Models/Comment";
import { isValidObjectId } from "mongoose";
import { verifyAccessToken, requireRole } from "@/src/utils/auth";
import { authMiddleware } from "@/src/middlewares/authmiddleware";
import { middleware } from "@/src/utils/middleware";

export default async function handler(req, res) {
    if (!["PATCH", "GET"].includes(req.method)) return res.status(405).json({ message: "Method not allowed" })

    try {
        await connectToDB();

        let reqAuthorization = req.headers.authorization;
        await middleware(reqAuthorization, res, authMiddleware);

        const { id } = req.query;

        const user = verifyAccessToken(req, res);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // if user wasn't admin it will throw err 
        requireRole(user, ["ADMIN"]);
        
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid comment ID",
            });
        }


        switch (req.method) {
            case "GET": {
                const comment = await Comment.findById(id).populate("productId");

                if (!comment) {
                    return res.status(404).json({
                        message: "Comment not found",
                    });
                }

                return res.status(200).json(comment);
            }

            case "PATCH": {
                const { isApproved } = req.body;

                const updated = await Comment.findByIdAndUpdate(
                    id,
                    { isApproved: Boolean(isApproved) },
                    { new: true }
                );

                if (!updated) {
                    return res.status(404).json({
                        message: "Comment not found",
                    });
                }

                return res.status(200).json(updated);
            }
        }

    } catch (err) {
        console.error("CONTACT GET ERROR:", err);
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}
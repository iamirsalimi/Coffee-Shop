import connectToDB from "@/src/configs/db";
import Contact from "@/src/Models/Contact";
import { isValidObjectId } from "mongoose";
import { verifyAccessToken, requireRole } from "@/src/utils/auth";


export default async function handler(req, res) {
    if (!["PATCH", "GET"].includes(req.method)) return res.status(405).json({ message: "Method not allowed" })

    try {
        const user = verifyAccessToken(req, res);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.query;

        // Validate MongoDB ObjectId early
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid contact ID"
            })
        }

        await connectToDB();


        switch (req.method) {
            case "GET": {
                const contact = await Contact.findById(id);

                // if user wasn't user , admin it will throw err 
                requireRole(user, ["ADMIN", "USER"]);

                if (!contact) {
                    return res.status(404).json({
                        message: "Message not found"
                    })
                }

                return res.status(200).json(contact)
            }

            case "PATCH": {
                // if user wasn't admin it will throw err 
                requireRole(user, ["ADMIN"]);

                const { isRead } = req.body;

                const updatedContact = await Contact.findByIdAndUpdate(
                    id,
                    { isRead: Boolean(isRead) },
                    { new: true }
                )

                if (!updatedContact) {
                    return res.status(404).json({
                        message: "Message not found",
                    })
                }

                return res.status(204).json({ data: updatedContact });
            }
        }
    } catch (err) {
        return res.status(405).json({
            message: "Method not allowed"
        })
    }
}
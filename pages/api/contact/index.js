import connectToDB from "@/src/configs/db";
import Contact from "@/src/Models/Contact";
import { verifyAccessToken, requireRole } from "@/src/utils/auth";
import { authMiddleware } from "@/src/middlewares/authmiddleware";
import { middleware } from "@/src/utils/middleware";

export default async function handler(req, res) {
    if (!["POST", "GET"].includes(req.method)) return res.status(405).json({ message: "Method not allowed" })

    try {
        await connectToDB();

        let reqAuthorization = req.headers.authorization;
        await middleware(reqAuthorization, res, authMiddleware);

        switch (req.method) {
            case "GET": {
                const messages = await Contact.find()
                    .sort({ createdAt: -1 })

                return res.status(200).json(messages)
            }

            case 'POST': {

                const { name, email, message } = req.body;

                if (!name || !email || !message) {
                    return res.status(400).json({
                        message: "All fields are required",
                    })
                }

                let contact = await Contact.create({
                    name,
                    email,
                    message
                })

                return res.status(201).json({ data: contact })
            }
        }
    } catch (err) {
        console.error("CONTACT GET ERROR:", err);
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}
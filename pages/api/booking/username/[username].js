import connectToDB from "@/src/configs/db";
import Booking from "@/src/Models/Booking";
import { verifyAccessToken, requireRole } from "@/src/utils/auth";

export default async function handler(req, res) {
    if (!["GET"].includes(req.method)) return res.status(405).json({ message: "Method not allowed" })

    try {
        const { username } = req.query;

        const user = verifyAccessToken(req, res);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // if user wasn't user it will throw err 
        requireRole(user, ["USER"]);

        await connectToDB();

        const booking = await Booking.find({ username });
        
        // console.log(booking , username)
        
        if (!booking) {
            return res.status(404).json({
                message: "booking not found",
            });
        }

        return res.status(200).json(booking);
    } catch (err) {
        console.error("CONTACT GET ERROR:", err);
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}
import connectToDB from "@/src/configs/db";
import Booking from "@/src/Models/Booking";
import { verifyAccessToken, requireRole } from "@/src/utils/auth";

export default async function handler(req, res) {
    if (!['POST', "GET"].includes(req.method)) return res.status(405).json({ message: "Method not allowed" });

    try {
        await connectToDB();


        const user = verifyAccessToken(req, res);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { username, fullname, phone, date, time, guests, description } = req.body

        switch (req.method) {
            case "GET": {
                // if user wasn't admin it will throw err 
                requireRole(user, ["ADMIN"]);

                const bookings = await Booking.find().sort({ createdAt: -1 });

                return res.status(200).json(bookings);
            }

            case "POST": {
                // if user wasn't user it will throw err 
                requireRole(user, ["USER"]);

                if (!username || !fullname || !phone || !date || !time || !guests) {
                    return res.status(400).json({
                        message: "All required fields must be filled",
                    });
                }

                const booking = await Booking.create({
                    username,
                    fullname,
                    phone,
                    date,
                    time,
                    guests,
                    description,
                });

                return res.status(201).json({
                    message: "Booking created successfully",
                    booking,
                });
            }
        }
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Err",
            err
        })
    }
}

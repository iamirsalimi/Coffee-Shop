import connectToDB from "@/src/configs/db";
import Booking from "@/src/Models/Booking";

export default async function handler(req, res) {
    if (!['POST', "GET"].includes(req.method)) return res.status(405).json({ message: "Method not allowed" });

    try {
        await connectToDB();

        const { fullname, phone, date, time, guests, description } = req.body

        switch (req.method) {
            case "GET": {
                const bookings = await Booking.find().sort({ createdAt: -1 });

                return res.status(200).json(bookings);
            }

            case "POST": {
                if (!fullname || !phone || !date || !time || !guests) {
                    return res.status(400).json({
                        message: "All required fields must be filled",
                    });
                }

                const booking = await Booking.create({
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

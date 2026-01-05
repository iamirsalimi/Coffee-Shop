import connectToDB from "@/src/configs/db";
import Booking from "@/src/Models/Booking";
import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";

export default async function handler(req, res) {
    if (!['PATCH', "GET"].includes(req.method)) return res.status(405).json({ message: "Method not allowed" });

    try {
        const { id } = req.query;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid booking ID",
            });
        }

        await connectToDB();

        switch (req.method) {
            case "GET": {
                const booking = await Booking.findById(id);

                if (!booking) {
                    return res.status(404).json({
                        message: "Booking not found",
                    });
                }

                return res.status(200).json(booking);
            }

            case "PATCH": {
                const { status } = req.body;

                if (!["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
                    return res.status(400).json({
                        message: "Invalid status value",
                    });
                }

                const updated = await Booking.findByIdAndUpdate(
                    id,
                    { status },
                    { new: true }
                );

                if (!updated) {
                    return res.status(404).json({
                        message: "Booking not found",
                    });
                }

                return res.status(200).json(updated);
            }
        }
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Err",
            err
        })
    }
}

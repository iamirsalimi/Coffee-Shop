
import connectToDB from "@/src/configs/db";
import User from "@/src/Models/User";
import Comment from "@/src/Models/Comment";
import Booking from "@/src/Models/Booking";
import { hashPassword, verifyPassword } from "@/src/utils/auth";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectToDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = req.query;

    const {
      firstname,
      lastname,
      email,
      username,
      oldPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    const oldUsername = user.username;

    // Check username uniqueness (if changed)
    if (username != oldUsername) {
      const usernameExists = await User.findOne({
        username,
        _id: { $ne: userId },
      });

      if (usernameExists) {
        await session.abortTransaction();
        return res.status(422).json({
          message: "Username already exists",
        });
      }
    }

    // Handle password
    let passwordValue = user.password;
    console.log(req.body)
    if (newPassword != -1) {
      const isValid = await verifyPassword(oldPassword, user.password);

      if (!isValid) {
        await session.abortTransaction();
        return res.status(422).json({
          message: "Current password is incorrect",
        });
      }

      passwordValue = await hashPassword(newPassword);
    }

    // Update user
    await User.findByIdAndUpdate(
      userId,
      {
        firstname,
        lastname,
        email,
        username,
        password: passwordValue,
      });

    // Sync username in other collections

    await Comment.updateMany(
      { username: oldUsername },
      { $set: { username } }
    );

    await Booking.updateMany(
      { username: oldUsername },
      { $set: { username } }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err)
    return res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
    });
  }
}

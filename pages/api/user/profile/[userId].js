import connectToDB from "@/src/configs/db";
import User from "@/src/Models/User";
import { hashPassword, verifyPassword } from "@/src/utils/auth";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDB();

    const userId = req.user.id; // from access token middleware

    const { firstname, lastname, email, username, oldPassword, newPassword } = req.body;


    let user = await User.find({ _id: userId })

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      });
    }

    let newPasswordValue = user.password;

    if (newPassword != -1) {
      let passwordFlag = await verifyPassword(oldPassword, user.password)

      if (!passwordFlag) {
        return res.status(422).json({
          message: "current password is incorrect"
        });
      }

      newPasswordValue = await hashPassword(newPassword)
    }

    updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstname,
        lastname,
        email,
        username,
        password: newPasswordValue
      },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
    });
  }
}

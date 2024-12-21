const User = require("../models/User");

exports.editProfile = async (req, res) => {
  try {
    const { profileImage, shopName, shopDescription, shopAddress } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage, shopName, shopDescription, shopAddress },
      { new: true }
    );

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

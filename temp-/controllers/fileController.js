const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");

exports.uploadFileWithUrls = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `isAuthenticated` middleware sets `req.user`
    const { powerPointUrl, wordDocumentUrl } = req.body;
    console.log("fileeee", req.file);
    // Validate user ID
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Retrieve user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update PowerPoint and Word document URLs
    user.powerPointUrl = powerPointUrl || user.powerPointUrl || null;
    user.wordDocumentUrl = wordDocumentUrl || user.wordDocumentUrl || null;

    await user.save();

    res.status(200).json({
      message: "URLs saved successfully",
      powerPointUrl: user.powerPointUrl,
      wordDocumentUrl: user.wordDocumentUrl,
    });
  } catch (err) {
    console.error("Error updating file or URL:", err.message);
    res.status(500).json({
      message: "An error occurred while processing the request",
      error: err.message,
    });
  }
};
exports.getFiles = async (req, res) => {
  try {
    const { imageId } = req.params;

    // Construct the full path to the file
    const filePath = path.join(__dirname, "../uploads", imageId);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    console.log(filePath);
    // Send the file to the client
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.error("Error fetching file:", error.message);
    res.status(500).json({ message: "Error fetching file", error });
  }
};

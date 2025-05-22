import Code from "../models/Code.js";

const uploadCode = async (req, res) => {
  try {
    const { code, room } = req.body;
    if (!code || !room) {
      return res.status(400).json({ message: "Code and room are required" });
    }

    const newCode = new Code({
      code: code,
      room: room,
    });

    const savedCode = await newCode.save();
    if (!savedCode) {
      return res.status(500).json({ message: "Failed to save code" });
    }
    res.status(200).json({ message: "Code uploaded successfully" });
  } catch (error) {
    console.error("Error uploading code:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCode = async (req, res) => {
  try {
    const room = req.params.room;
    if (!room) {
      return res.status(400).json({ message: "Room is required" });
    }

    const code = await Code.findOne({ room: room });
    if (!code) {
      return res.status(404).json({ message: "Code not found" });
    }
    res.status(200).json({code : code});
  } catch (error) {
    console.error("Error fetching code:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export { uploadCode, getCode };

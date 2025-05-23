import Code from "../models/Code.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const uploadCode = async (req, res) => {
  try {
    const { code, room } = req.body;

    if (!code || !room) {
      return res.status(400).json({ message: "Code and room are required" });
    }

    const updatedCode = await Code.findOneAndUpdate(
      { room: room },               
      { code: code },               
      { new: true, upsert: true }  
    );

    if (!updatedCode) {
      return res.status(500).json({ message: "Failed to save or update code" });
    }

    res.status(200).json({ message: "Code saved/updated successfully" });
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
    res.status(200).json({code : code.code});
  } catch (error) {
    console.error("Error fetching code:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const runIt = async (req, res) => {
  const { code, language } = req.body;

  const langMap = {
    c: 50,
    cpp: 54,
    java: 62,
    python: 71,
  };

  const language_id = langMap[language];
  if (!language_id) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  const encodedCode = Buffer.from(code).toString("base64");
  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true',
    headers: {
      'content-type': 'application/json',
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Make sure this is set
    },
    data: {
      source_code: encodedCode,
      language_id: language_id,
    }
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error running code:", error.response?.data || error.message);
    res.status(500).json({ error: "Code execution failed", detail: error.response?.data });
  }
};


export { uploadCode, getCode,runIt };

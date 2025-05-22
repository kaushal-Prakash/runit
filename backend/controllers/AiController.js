import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const getSuggestion = async (req, res) => {
  const code = req.body.code;

  const ai = new GoogleGenAI({ apiKey: process.env.GIMINI });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${code} - Give me only brief hints to fix the errors in the following code. Do not correct the code, just point out where the issues are and what kind of fix is needed.`,
    });
    return res.status(200).send({
      message: "Received values and processed with AI",
      hints: response.text,
    });
  } catch (error) {
    console.error("Error processing AI request:", error);
    return res.status(500).send({ error: "Failed to process the AI request" });
  }
};

export { getSuggestion };

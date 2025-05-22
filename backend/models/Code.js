import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
    room:{
        type:Number,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 6,
    },
});

export default mongoose.models.Code || mongoose.model("Code", codeSchema);

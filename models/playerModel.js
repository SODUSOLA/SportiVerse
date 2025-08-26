import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        position: { type: String, required: true },
        number: { type: Number },
        nationality: { type: String },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Player", playerSchema);

import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
                required: true,
                unique: true,
                trim: true,
        },
        code: {
            type: String,
                required: true,
                unique: true,
                uppercase: true,
                minlength: 2,
                maxlength: 5,
        },
        crest: {
            type: String, // URL of image
                default: null,
        },
        coach: {
            type: String, // I'm coming
                required: true,
        },
        players: [
        {
            type: mongoose.Schema.Types.ObjectId,
                ref: "Player", // references Player model
        },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Team", teamSchema);

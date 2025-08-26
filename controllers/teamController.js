import Team from "../models/teamModel.js";

// Create a team
export const createTeam = async (req, res) => {
    try {
        const { name, code, coach } = req.body;

        const team = new Team({ name, code, coach });
        await team.save();
        
        
        res.status(201).json({
        message: "Team created successfully",
        team,
        });
    } catch (error) {
        console.error("Error creating team:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all teams (populated with list of players)
export const getTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate("players", "name position number nationality");
        res.status(200).json({ teams });
    } catch (error) {
        console.error("Error fetching teams:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

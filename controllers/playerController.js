import Player from "../models/playerModel.js";
import Team from "../models/teamModel.js";

export const createPlayer = async (req, res) => {
    try {
        const { name, position, number, nationality, teamName } = req.body;

        
        const team = await Team.findOne({ name: teamName });
        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }


        const player = new Player({
            name,
            position,
            number,
            nationality,
            team: team._id,
        });
        await player.save();


        team.players.push(player._id);
        await team.save();


        await player.populate({ path: "team", select: "name" });


        const responsePlayer = {
            ...player.toObject(),
            team: player.team?.name || null,
        };

        res.status(201).json({
            message: "Player created and assigned to team successfully",
            player: responsePlayer,
        });
    } catch (error) {
        console.error("Error creating player:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

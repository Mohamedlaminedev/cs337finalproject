// Since only friend allow to do the split bill, so we add a validation here

const Friend = require('../models/Friend');
const User = require('../models/User');

const validateSplitBillParticipants = async (req, res, next) => {
    try {
        const { userId, participants } = req.body;

        if (!Array.isArray(participants) || participants.length === 0) {
            return res.status(400).json({ message: 'Must have at least one participant to split' });
        }

        // Get all participant users
        const participantUsers = await User.find({
            username: { $in: participants }
        });

        if (participantUsers.length !== participants.length) {
            return res.status(404).json({ message: 'One or more participants not found' });
        }

        //  each participant need to check friend status to split bill.
        for (const participant of participantUsers) {
            const friendship = await Friend.findOne({
                $or: [
                    { user: userId, friend: participant._id },
                    { user: participant._id, friend: userId }
                ],
                status: 'accepted'
            });

            if (!friendship) {
                return res.status(403).json({
                    message: `Must be friends with ${participant.username} to split bill`
                });
            }
        }

        // include the participant IDs to request for use in route handler
        req.participantIds = participantUsers.map(user => user._id);
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { validateSplitBillParticipants };
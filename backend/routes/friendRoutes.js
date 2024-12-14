// routes/friendRoutes.js
const express = require('express');
const router = express.Router();
const Friend = require('../models/Friend');
const User = require('../models/User');

// Send friend request
router.post('/request', async (req, res) => {
    try {
        const { userId, friendUsername } = req.body;

        // Find friend by username
        const friendUser = await User.findOne({ username: friendUsername });
        if (!friendUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if trying to add self
        if (userId === friendUser._id.toString()) {
            return res.status(400).json({ message: 'Please do not add yourself as friend' });
        }

        // Check if friendship already exists
        const existingFriend = await Friend.findOne({
            $or: [
                { user: userId, friend: friendUser._id },
                { user: friendUser._id, friend: userId }
            ]
        });

        if (existingFriend) {
            return res.status(400).json({ message: 'Friend request already sent and please wait for respond' });
        }

        // Create friend request
        const friendRequest = new Friend({
            user: userId,
            friend: friendUser._id
        });

        await friendRequest.save();

        res.status(201).json({
            message: 'Friend request sent',
            friendRequest: await Friend.findById(friendRequest._id)
                .populate('user friend', 'username')
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Accept friend request
router.post('/accept', async (req, res) => {
    try {
        const { userId, requestId } = req.body;

        const friendRequest = await Friend.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: 'Not found' });
        }

        // Verify the request is for this user
        if (friendRequest.friend.toString() !== userId) {
            return res.status(403).json({ message: 'Can not accept this request,because it is not for you sorry.' });
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        res.json({
            message: 'Friend request accepted',
            friendRequest: await Friend.findById(requestId)
                .populate('user friend', 'username')
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reject friend request
router.post('/reject', async (req, res) => {
    try {
        const { userId, requestId } = req.body;

        const friendRequest = await Friend.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: 'No Friend request right now' });
        }

        // check if the request is for this user
        if (friendRequest.friend.toString() !== userId) {
            return res.status(403).json({ message: 'can not reject this request,because it is not for you sorry.' });
        }

        friendRequest.status = 'rejected';
        await friendRequest.save();

        res.json({
            message: 'Friend request rejected',
            friendRequest: await Friend.findById(requestId)
                .populate('user friend', 'username')
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// we get the friend list
router.get('/list/:userId', async (req, res) => {
    try {
        const friends = await Friend.find({
            $or: [
                { user: req.params.userId },
                { friend: req.params.userId }
            ],
            status: 'accepted'
        }).populate('user friend', 'username');

        //  make response show friend's information
        const formattedFriends = friends.map(friendship => {
            const friend = friendship.user._id.toString() === req.params.userId ?
                friendship.friend : friendship.user;
            return {
                friendshipId: friendship._id,
                friendId: friend._id,
                username: friend.username
            };
        });

        res.json(formattedFriends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get pending friend requests
router.get('/pending/:userId', async (req, res) => {
    try {
        const pendingRequests = await Friend.find({
            friend: req.params.userId,
            status: 'pending'
        }).populate('user', 'username');

        res.json(pendingRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Check if users are friends
router.get('/check/:userId/:otherUserId', async (req, res) => {
    try {
        const friendship = await Friend.findOne({
            $or: [
                { user: req.params.userId, friend: req.params.otherUserId },
                { user: req.params.otherUserId, friend: req.params.userId }
            ],
            status: 'accepted'
        });

        res.json({ areFriends: !!friendship });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
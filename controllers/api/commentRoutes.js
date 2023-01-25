const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require ('../../utils/auth');

router.get('/', async (req,res) => {
    try {
        const commentData = await Comment.findAll({});
        if (!commentData) {
            res.status(404).json({message: 'No comments found!'}) // Once again (for these 2 lines of code), stack overflow comes to the rescue, I see how this functions but I probably wouldnt have come to this myself
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err)
    }
});

router.get('/:id', async (req,res) => {
    try {
        const commentData = await Comment.findAll({
            where: {id: req.params.id},
        });
        if (!commentData) {
            res.status(404).json({message: 'No comment found!'});
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', withAuth, async (req, res) => {
    try {
        const createdComment = await Comment.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        res.status(200).json(createdComment);
    } catch (err) {
        res.status(500).json(err);
    };
});

router.delete('/:id', withAuth, async (req,res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id
            },
        });
        if(!commentData) {
            res.status(404).json({message: 'No comment found!'});
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router 
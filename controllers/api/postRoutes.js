const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require ('../../utils/auth');

router.get('/', async (req,res) => {
    try {
        const postData = await Post.findAll({
            attributes: ['id','title','content','created_at'],
            oder: [['created_at', 'DESC']], //not clear on these 2 lines, they were created with help from stack overflow but the explanation is hazy
            include: [
                {model: User,
                attributes: ['username']
                },
                {model: Comment,
                attributes: [
                    'id',
                    'comment_content',
                    'post_id',
                    'user_id',
                    'created_at',
                ],
            include: {model: User,
            attributes: ['username']
                },
            },
            ],
        });
        res.status(200).json(postData) //Tutor said to think about .reverse() method for the postData, but not sure why yet?
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/:id', async (req,res) => {
    try{
        const postData = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'post_content',
                'created_at'
            ],
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment_content',
                        'post_id',
                        'user_id',
                        'created_at',
                    ],
                    include: {model: User,
                        attributes: ['username']
                            },
                },
            ],
        });
        if (!postData) {
            res.status(404).json({ message: 'No posts could be found with that id!'});
            return;
        }
        res.status(200).json(postData);
    } catch(err) {
        res.status(400).json(err);
    }
});

router.post('/', withAuth, async (req,res) => {
    try {
        const createdPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id
        });
        res.status(200).json(createdPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', withAuth, async (req,res) => {
    try {
        const updatedPost = await Post.update(
            {
                title: req.body.title,
                post_content: req.body.post_content,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        if(!updatedPost) {
            res.status(404).json({ message: 'No posts could be found with that id!' });
            return;
        }
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.delete('/:id', withAuth, async (req,res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });
        if (!postData) {
            res.status(404).json({ message: 'No posts from that user could be found!'});
            return;
        }
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router
const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
// const withAuth = require ('../../utils/auth'); Dont think its necessary to keep this - no auth required for user routes I think? 

router.get('/', async (req,res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ['password']},
        });
        res.status(200).json(userData);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try { 
        const userData = await User.findOne({
            attributes: { exclude: ['password']},
            where: {id: req.params.id},
            include: [
                {
                    model: Post,
                    attributes: [
                        'id',
                        'title',
                        'post_content',
                        'created_at'
                ],
                },
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment_content',
                        'created_at',
                    ],
                    include: {
                        model: Post,
                        attributes: ['title'],
                    },
                },
                {
                    model: Post,
                    attributes: ['title'],
                },
            ],
        });
        if (!userData) {
            res.status(404).json({message: 'No user id could be found!'});
            return
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/', async (req,res) => {
    try {
        const userData = await User.create(req.body);
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.logged_in = true; 
            res.status(200).json({ message: 'User created!'}) //this entire codeblock was essentially a similar example i found on stack overflow and repurposed, I understand what its doing but it took so long, my version did not look like this at all             
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req,res) => {
    try {
        const userData = await User.findOne({
            where: { username: req.body.username},
        });
        if (!userData) {
            res.status(400).json({ message: 'No user found!'});
            return;
        }
        const workingPw = await userData.checkPassword(req.body.password);
        if(!workingPw) {
            res.status(400).json({message: 'That password seems to be inccorect! Please verify your login credentials and try again.'});
            return;
        };
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.logged_in = true; 

            res.json({message: 'Logged in!'});
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', async (req,res) => {
    try {
        if (req.session.logged_in) {
            const userData = await req.session.destroy(() => {
                res.status(200).end();
            });
        } else {
            res.status(404).end();
        }
    } catch {
        res.status(400).end();
    }
});

module.exports = router;
//This logout block was also something that I am testing from stack overflow, dont really understand the 404/400 distinction when it comes to logging out and errors that come from these
// From my understanding, the 404 is a logout on a non-existing session? the 400 is when the destroy doesnt work? 
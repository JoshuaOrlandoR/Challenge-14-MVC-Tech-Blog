const router = require('express').Router();
const { Comment, Post, User } = require('../models'); 
const withAuth = require ('../utils/auth');

router.get('/', async (req,res) => {
    try {
        const postData = await Post.findAll({
            include: [{
                model: User,
                attributes: ['username'],
            }],
        });
        const posts = postData.map((post) => post.get({
            plain: true
        }));

        res.render('homepage', { //still need to make views but this will be one of the handlebars
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/post/:id', async (req,res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    include: [User]
                }
            ],
        });
        const post = postData.get({
            plain:true
        });
        res.render('post', {
            ...post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('dashboard', async (req,res) => {
    try {
        const userData = await User.findByPk(req.session,user_id, {
            attributes: {
                exclude: ['password']
            },
            include: [{ model: Post}],
        });
        const user = userData.get({ plain: true});

        res.render('dashboard', { //another view to be made based on examples found online and how the routes will work
            ...user, 
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login,', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('dashboard'); // is there another way to just redirect to the same route? check for this, might make the code a bit more clean                                     
        return;
    }
    res.render('login') // ANOTHER VIEW 
});

router.get('/register', (req,res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }
    res.render('register') // ANOTHER VIEW 
});

module.exports = router; 


//Unsure if this format is actually correct - going off what we did in the mini-project and altering it based on my models 
const sequelize = require('../config/connection');
const { Comment, Post, User } = require('../models');
const commentData = require('./commentData.json')
const postData = require('./postData.json');
const userData = require('./userData.json');

const seedDatabase = async () => {
    await sequelize.sync({force:true});

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    const posts = await Post.bulkCreate(postData, {
        individualHooks: true,
        returning: true, 
    });

    const comments = await Comment.bulkCreate(commentData, {
        individualHooks: true, 
        returning: true,
    });

    process.exit(0);
};

seedDatabase();


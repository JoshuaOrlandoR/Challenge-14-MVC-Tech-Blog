const Comment = require('./Comment');
const Post = require('./Post');
const User = require('./User');

User.hasMany(Post, {
    foreignKey: 'user_id',
});

User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
});

Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: 'cascade',
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
}); //ask about how relavent having this is, is this not the same as the first block of code? I see how they can be different but make sure to get clarity on this, will include the other "pairs" for now just in case

Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'cascade',    
});

module.exports = {
    User,
    Post,
    Comment
};
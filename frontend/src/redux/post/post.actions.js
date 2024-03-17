import ActionTypes from './post.types';

export const setNewPinnedPost = (post) => ({
    type:ActionTypes.SET_PINNED_POST,
    post:post
});

export const newPosts = (posts) => ({
    type:ActionTypes.NEW_POSTS,
    posts: posts
});

export const putPostsLast = (posts) => ({
    type:ActionTypes.PUT_POSTS_LAST,
    posts: posts
});

export const putPosts = (posts) => ({
    type:ActionTypes.PUT_POSTS,
    posts: posts
});

export const updatePost = (post) => ({
    type:ActionTypes.UPDATE_POST,
    post: post
});

export const deletePost = (post) => ({
    type:ActionTypes.DELETE_POST,
    post: post
});
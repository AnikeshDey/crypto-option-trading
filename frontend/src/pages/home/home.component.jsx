import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSocket } from "../../socket/socket";

import MainLayout from '../../layouts/main-layout.component';
import PostForm from '../../components/postForm/postForm.component';

import { newPosts } from "../../redux/post/post.actions";
import { setPageType } from "../../redux/page/page.actions";

function HomePage({ token, user, posts, pinnedPost, newPosts, setPageType }) {

	const [page, setPage] = useState(1);

	useSocket()
	////console.log("from home " + user)

	React.useLayoutEffect(() => {
		setPageType('default');
	},[]);


	useEffect(() => {
		if (user) {
			////console.log("fetched...");
			async function postData(url = '', data = {}) {
				// Default options are marked with *
				const response = await fetch(url, {
					method: 'GET', // *GET, POST, PUT, DELETE, etc.
					mode: 'cors', // no-cors, *cors, same-origin
					headers: {
						'Authorization': 'Bearer ' + token,
						// 'Content-Type': 'application/x-www-form-urlencoded',
					}
					// body data type must match "Content-Type" header
				});
				return response.json(); // parses JSON response into native JavaScript objects
			}
			postData(`${process.env.REACT_APP_URL_LINK}/api/posts?followingOnly=${true}`)
				.then(data => {
					//.log(data);
					newPosts(data); // JSON data parsed by `data.json()` call
				}).catch(err => {
					//console.log(err)
				});
		}
	}, [token, user, pinnedPost]);

	window.onscroll = function (event) {
		if (window.location.pathname == '/') {
			if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
				//alert("done");
				setPage(page => page + 1);
			}
		}
	}

	return (
		<MainLayout>
			<PostForm />
			<div className='postsContainer'>
				{
					posts && posts.slice(0, page * 10).map((post, i) => {
						if (i % 5 === 0) {
							return <React.Fragment key={post._id + post.name}>
							</React.Fragment>
						} else {
						}
					})
				}
			</div>
		</MainLayout>
	);
}

const mapStateToProps = state => ({
    user: state.user.user,
    token: state.user.token,
	posts: state.post.posts,
	pinnedPost: state.post.pinnedPost
})
  
const mapDispatchToProps = dispatch => ({
	newPosts: posts => dispatch(newPosts(posts)),
	setPageType: type => dispatch(setPageType(type))
})

  
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
  
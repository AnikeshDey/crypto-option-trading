import * as React from "react";
import { useParams, Link } from "react-router-dom";

import { connect } from "react-redux";

import { setPageType } from '../../redux/page/page.actions';

import { userLogin } from "../../redux/user/user.actions";
import { newPosts, setNewPinnedPost } from "../../redux/post/post.actions";

import MainLayout from '../../layouts/main-layout.component';
import Post from '../../components/post/post.component';
import Modal from '../../components/modal/Modal';


import { useSocket, socket } from "../../socket/socket";

function ProfilePage({ user, token, login, posts, newPosts, pinnedPost, setPinnedPost, setPageType }) {

    useSocket();

    const [tab, setTab] = React.useState('post');
    const [profile, setProfile] = React.useState(null);
    const [isProfilePictureModalOpen, setProfilePictureModalOpen] = React.useState(false);
    const [profilePicture, setProfilePicture] = React.useState(null);

    const [page, setPage] = React.useState(1);

    const id = useParams().id;

    const handleTabChange = () =>{
        tab === 'post' ? setTab('reply') : setTab('post');
    }

	const handleFollow = () =>{
		// Example POST method implementation:
		async function putData(url = '') {
			// Default options are marked with *
			const response = await fetch(url, {
			method: 'PUT', // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			mode: 'cors'
			});
			return response.json(); // parses JSON response into native JavaScript objects
		}
		
		putData(`${process.env.REACT_APP_URL_LINK}/api/users/${profile._id}/follow`)
			.then(data => {
					////console.log(data);
                    if(profile._id != user._id) {
                        socket.emit("notification recieved", profile._id);
                    }
					login(data.user._doc, data.token);	
		}).catch(err => {
            //console.log(err)
        });
    }

    var cropper;
    
    const handleProfilePictureInput = (event) => {   
        //console.log(event.target.files[0]);
        if(event.target.files && event.target.files[0]){
            var reader = new FileReader();
            reader.onload = (e) => {
                setProfilePicture(e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    const handleProfilePictureUpload = () => {
        if(profilePicture){
            var formData = new FormData();
		    formData.croppedImage = profilePicture;
            //console.log(formData)
            var url;
         	url = `${process.env.REACT_APP_URL_LINK}/api/users/profilePicture`;
            
            async function getData(url = '', data = {}) {
                // Default options are marked with *
                const response = await fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data'
                },
                body:formData
                // body data type must match "Content-Type" header
            });
                return response.json(); // parses JSON response into native JavaScript objects
            }
      
            getData(url)
            .then(data => {
                //console.log(data);
                setProfilePictureModalOpen(false);
                setProfilePicture(null);
                login(data.user._doc, data.token);
                //setProfile(data.profileUser); // JSON data parsed by `data.json()` call
            }).catch(err => {
                //console.log(err)
            });
        }
    }

    React.useLayoutEffect(() => {
        setPageType('social');
      },[]);

    React.useEffect(() => {
        if(user){
            var url;
         	url = `${process.env.REACT_APP_URL_LINK}/profile/${id}`;
            
            async function getData(url = '', data = {}) {
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
      
            getData(url)
            .then(data => {
                //console.log(data);
                setProfile(data.profileUser); // JSON data parsed by `data.json()` call
            }).catch(err => {
                //console.log(err)
            });
        }

    },[token,user,id])

    
    React.useEffect(() => {
        if(user && profile){

            const url = `${process.env.REACT_APP_URL_LINK}/api/posts?postedBy=${profile._id}&pinned=${true}`;
          
              async function postData(url = '') {
                  // Default options are marked with *
                  const response = await fetch(url, {
                  method: 'GET', // *GET, POST, PUT, DELETE, etc.
                  mode: 'cors', // no-cors, *cors, same-origin
                  headers: {
                      'Authorization': 'Bearer ' + token
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                  }
                  // body data type must match "Content-Type" header
                      });
                      return response.json(); // parses JSON response into native JavaScript objects
              }
        
              postData(url)
              .then(data => {
                  //.log(data);
                  if(Array.isArray(data)){
                      data = data[0];
                  }
                  setPinnedPost(data); // JSON data parsed by `data.json()` call
              }).catch(err => {
                //console.log(err)
            });
        }
    }, [token, user, tab, profile]);

    React.useEffect(() => {
        if(user && profile){
            const url = tab === 'post' ? `${process.env.REACT_APP_URL_LINK}/api/posts?postedBy=${profile._id}&isReply=${false}&pinned=${false}` : process.env.REACT_APP_URL_LINK +'/api/posts?postedBy=' + profile._id + '&isReply=' + true;
          
              async function postData(url = '') {
                  // Default options are marked with *
                  const response = await fetch(url, {
                  method: 'GET', // *GET, POST, PUT, DELETE, etc.
                  mode: 'cors', // no-cors, *cors, same-origin
                  headers: {
                      'Authorization': 'Bearer ' + token
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                  }
                  // body data type must match "Content-Type" header
                      });
                      return response.json(); // parses JSON response into native JavaScript objects
              }
              newPosts([])
              postData(url)
              .then(data => {
                  //.log(data);
                  newPosts(data); // JSON data parsed by `data.json()` call
              }).catch(err => {
                //console.log(err)
            });
        }
    }, [token, user, tab, profile, pinnedPost]);

    window.onscroll = function(event){
        if(window.location.pathname == `/profile/${id}`){
            if((window.innerHeight + window.scrollY) >= document.body.scrollHeight){
                //alert("done");
                setPage(page => page + 1);
            }
        }
    }


  return (

      <MainLayout>
          { isProfilePictureModalOpen && <Modal 
            show={isProfilePictureModalOpen}
            onCancel={() => setProfilePictureModalOpen(false)}
            header={"Upload Profile Picture"}
            footer={<><button onClick={() => setProfilePictureModalOpen(false)} className="btn btn-lg btn-danger">Close</button>
            <button onClick={handleProfilePictureUpload} className="btn btn-lg btn-primary" disabled={profilePicture == null}>Upload</button></>
            }
        > 
        <>
            <input id="filePhoto" type="file" onInput={handleProfilePictureInput} name="filePhoto" />
            <div className="imagePreviewContainer">
                <img src={profilePicture} id="imagePreview" />
            </div>
        </>
        
        </Modal>
    }
      		{ user && profile && <><div className="profileHeaderContainer">
                <div className="coverPhotoSection">
                    <div className="coverPhotoContainer">
                        <img src={`http://localhost:5000${profile.coverPhoto}`} alt="User's Cover Photo"/>
						{
							profile._id == user._id && <button className="coverPhotoButton">
                            	<i className="fas fa-camera"></i>
                       		</button>
						}
                 
                    </div>
                    <div className="userImageContainer">
                        <img src={`http://localhost:5000${profile.profilePic}`} alt="Users Profile Picture" />
						{
							profile._id == user._id && <button className="profilePictureButton" onClick={() => setProfilePictureModalOpen(true)}><i className="fas fa-camera"></i></button>
						}
                        
                    </div>
                </div>
                <div className="profileButtonsContainer">
                	{
						profile._id != user._id &&
							<a href="#" className="profileButton">
				                <i className="fas fa-envelope"></i>
				            </a>
					}
					{ profile._id.toString() != user._id.toString() ?
						   (user.following && 
						   user.following.includes(profile._id) ?
								<button onClick={handleFollow} className="followButton following">Following</button>
							:
								<button onClick={handleFollow}className="followButton">Follow</button>)
						: ''
						
					}                    		
					
                    
                </div>
                <div className="userDetailsContainer">
                    <span className="displayName">{profile.firstName + ' ' + profile.lastName}</span>
                    <span className="username">@{profile.username}</span>
                    <span className="description">{profile.description}</span>
                    <div className="followersContainer">
                        <Link to={`/followers-following/${profile._id}/following`}>
                            <span className="value">{profile.following.length || ' '}</span>
                            <span>Following</span>
                        </Link>
                        <Link to={`/followers-following/${profile._id}/follower`}>
                            <span id="followersValue" className="value">{profile.followers.length || ' '}</span>
                            <span>Followers</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="tabsContainer">
                <button onClick={handleTabChange} className={`tab ${tab === 'post' ? 'active' : ''}`}><span>Posts</span></button>
                <button onClick={handleTabChange} className={`tab ${tab === 'reply' ? 'active' : ''}`}><span>Replies</span></button>
            </div>
            <div className="pinnedContainer">
                    {
                        pinnedPost && <Post postData={pinnedPost} />
                    }
            </div>
            <div className="postsContainer">
                {
      				posts && posts.slice(0, page * 10).map(post => {
      					return <Post key={post._id} postData={post} />
      				})
      			}
            </div> </>}
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
    login: (user, token) => dispatch(userLogin(user, token)),
    newPosts: posts => dispatch(newPosts(posts)),
    setPinnedPost: post => dispatch(setNewPinnedPost(post)),
    setPageType: (pageType) => dispatch(setPageType(pageType))
})
  
export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
  
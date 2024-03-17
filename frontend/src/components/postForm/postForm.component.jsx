import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";

import { putPosts } from "../../redux/post/post.actions";


function PostForm({ user, token, putPosts }) {
  const { t } = useTranslation(["common"]);
  const [ value, setValue ] = useState("");
  var invalid = value.trim() === "" ? true : false; 
  

  
  
  const handleChange = (event) => {
  	const value = event.target.value;
  	
  		setValue(value);
	
  }
  
  const handleSubmit = (event) => {
	if(!invalid){
		invalid = true;
		// Example POST method implementation:
	async function postData(url = '', data = {}) {
		// Default options are marked with *
		const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		headers: {
			'Authorization': 'Bearer ' + token,
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		}, // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(data) // body data type must match "Content-Type" header
		});
		return response.json(); // parses JSON response into native JavaScript objects
	}
	
	postData(`${process.env.REACT_APP_URL_LINK}/api/posts`, { content: value})
		.then(data => {
			setValue("");
			////console.log(data);
			putPosts([data]);// JSON data parsed by `data.json()` call
		})
	}
  
  }
  ////console.log(user)

  return (
	  user &&  (<div className='postFormContainer'>
	  <div className='userImageContainer'>
		  <img src={`http://localhost:5000${user.profilePic}`} alt="User's profile" />
	  </div>   
	  <div className='textareaContainer'>
		  <textarea id='postTextarea' placeholder={t("placeholder")} onChange={handleChange} value={value} />
		  <div className='buttonsContainer'>
			  <button type="button" id='submitPostButton' disabled={invalid} onClick={handleSubmit}>{t("post")}</button>
		  </div>
	  </div>   
	</div>) 
  );
}

const mapStateToProps = state => ({
    user: state.user.user,
    token: state.user.token
})

const mapDispatchToProps = dispatch => ({
	putPosts: posts => dispatch(putPosts(posts))
})


  
  
export default connect(mapStateToProps, mapDispatchToProps)(PostForm);

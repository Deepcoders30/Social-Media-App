import React, { useState } from 'react'
import "./createpost.scss";
import Avatar from '../Avatar/Avatar';
import {BsCardImage} from "react-icons/bs";
import { axiosClient } from '../../utils/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/slices/appConfigSlice';
import { getUserProfile } from '../../redux/slices/postsSlice'; 




function CreatePost() {
  
  const dispatch=useDispatch();
  const [postImg, setPostImg]=useState("");
  const [caption, setCaption]=useState("");
  const myProfile=useSelector(state=>state.appConfigReducer.myProfile);
  

  function handleImageChange(event){
    const file=event.target.files[0];
    const fileReader=new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload=()=>{
      if(fileReader.readyState === fileReader.DONE){
        setPostImg(fileReader.result)
      }
    }
  }   
  
  const handlePostSubmit=async ()=>{
    try{
    const response=await axiosClient.post("/post", {
        caption,
        postImg
    })
    dispatch(getUserProfile({
      userId: myProfile?._id
    }));
  }

finally{
 setCaption("");
 setPostImg("");
}

}
  return (
    <div className='CreatePost'>

    <div className="left-part">
        <Avatar src={myProfile?.avatar?.url} />
    </div>
    <div className="right-part">
        <input 
        value={caption}
        type="text"
        className='captionInput'
        placeholder="What's on your mind?"
        onChange={(e)=>setCaption(e.target.value)} />
        {postImg && (
            <div className="img-container">
            <img className='post-img' src={postImg} alt="post-img" />
        </div>
        )}
        
        <div className="bottom-part">
        <div className="input-post-img">
          <label htmlFor="inputImg" className='labelImg'>
              <BsCardImage />
            </label>
            <input className="inputImg"
            id="inputImg"
            type="file"
            accept='image/*'
            onChange={handleImageChange} />
          </div>    
        
        <button className='post-btn btn-primary' onClick={handlePostSubmit}>Post</button>
                   
        </div> 
    </div>

    </div>
  )
}

export default CreatePost
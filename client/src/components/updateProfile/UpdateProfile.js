import React, { useEffect, useState } from 'react';
import "./updateProfile.scss";
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, updateMyProfile } from '../../redux/slices/appConfigSlice';

function UpdateProfile() {
  const dispatch=useDispatch();
  const myProfile=useSelector(state=>state.appConfigReducer.myProfile);
  const [name, setName]=useState("");
  const [bio, setBio]=useState("");
  const [userImg, setUserImg]=useState(""); 

  useEffect(()=>{
    setName(myProfile?.name || "");
    setBio(myProfile?.bio || "");
    setUserImg(myProfile?.avatar?.url || "");
  }, [myProfile]);

  function handleImageChange(event){
    const file=event.target.files[0];
    const fileReader=new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload=()=>{
      if(fileReader.readyState === fileReader.DONE){
        setUserImg(fileReader.result)
      }
    }
  }

  function handleSubmit(event){
    event.preventDefault();
    dispatch(updateMyProfile({
      name,
      bio,
      userImg
    }))

  }
  return (
    <div className='UpdateProfile'>
       <div className="container">
        <div className="left-part">
          <div className="input-user-img">
            <label htmlFor="inputImg" className='labelImg'>
              <img src={userImg} alt={name} />
            </label>
            <input className="inputImg" id="inputImg" type="file" accept='image/*' onChange={handleImageChange} />
          </div>
        </div>
        <div className="right-part">
            <form onSubmit={handleSubmit}>
                <input value={name} type="text" placeholder='Your Name' onChange={(event)=>setName(event.target.value)} />
                <input value={bio} type="text" placeholder='Your Bio'  onChange={(event)=>setBio(event.target.value)} />
                <input type="submit" className='btn-primary' />
            </form>

            <button className='delete-account btn-primary'>Delete Account</button>
        </div>
       </div>
    </div>
  )
}

export default UpdateProfile
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { uploadImage } from "../utills/uploadImage";
import { printSupabase, supabase } from "../supabaseClient";
import {
  deleteFailure,
  deleteStart,
  deleteSucces,
  signOutFailure,
  signOutStart,
  signOutSucces,
  uploadFailure,
  uploadStart,
  uploadSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
   
  let fileRef = useRef(null);
  const { currentUser, error } = useSelector((store) => store.user);
  const [imageUrl, setImageUrl] = useState("");
  const [formData, setFormData] = useState({});
  const [showListingError, setShowListingError] = useState(null);
  const [userListings, setUserListings] = useState({});

  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);


  //this function pick the selected picture from input and save it in file variable
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    handleUpload(file);
  };

  //this function call to uploadImage function that is in separate file
  //and set public url on the useState() of imageUrl
  const handleUpload = async (file) => {
    const result = await uploadImage(file);
    if (result.error) {
      alert("Upload failed: " + result.error);
    } else {
      setImageUrl(result.publicData.publicUrl);
      console.log(result.publicData.publicUrl);
      setFormData({ ...formData, avatar: result.publicData.publicUrl });
      console.log(formData);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  //submit updated data to server to update at server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(uploadStart());
      const response = await fetch(`https://mern-estate-backend-delta.vercel.app/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const jsonData = await response.json();
      if (jsonData.success == false) {
        dispatch(uploadFailure(jsonData.message));
        setUpdateSuccess(false);
        return;
      }
      dispatch(uploadSuccess(jsonData));
      setUpdateSuccess(true);
    } catch (e) {
      dispatch(uploadFailure(e.message));
      setUpdateSuccess(false);
    }
  };

  //delete User Account from server
  const deleteUser = async () => {
    try {
      dispatch(deleteStart());
      const response = await fetch(`https://mern-estate-backend-delta.vercel.app/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const jsonData = response.json();
      if (jsonData.success == false) {
        dispatch(deleteFailure(jsonData.message));
        return;
      }
      dispatch(deleteSucces(jsonData));
    } catch (e) {
      dispatch(deleteFailure(e.message));
    }
  };

  // handle sign out functionality
  const signOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch(`https://mern-estate-backend-delta.vercel.app/auth/sign-out`, { method: "GET" });
      const jsonData = await res.json();
      if (jsonData.success == false) {
        dispatch(signOutFailure(jsonData.message));
        return;
      }
      dispatch(signOutSucces(jsonData));
    } catch (e) {
      dispatch(signOutFailure(jsonData.message));
    }
  };

  //get user's all listings from server
  const handleShowListing = async () => {
    try {
      const response = await fetch(`https://mern-estate-backend-delta.vercel.app/user/listings/${currentUser._id}`, {
        method: "GET",
        credentials: 'include'
      });
      const jsonData = await response.json();
      if (jsonData.success == false) {
        setShowListingError(jsonData.message);
        return;
      }
      setShowListingError(null);
      console.log(jsonData);
      setUserListings(jsonData);
    } catch (e) {
      setShowListingError(e.message);
    }
  };

  //delete listing

  const delListing= async (id)=>{
    try{
      const response = await fetch(`https://mern-estate-backend-delta.vercel.app/listing/delete/${id}`, {
        method: 'DELETE',
      });
      const jsonData= await response.json();
      if(jsonData.success==false){
        console.log(jsonData.message);
        return
      }
      console.log("Delete successfully");
      setUserListings((previousList)=>
      previousList.filter((listing)=>{
        return listing._id !== id;
      }))

    }catch(e){}
  }

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div>
        <h1 className="text-center text-3xl text font-semibold my-7">
          Profile
        </h1>
      </div>

      <div className="flex justify-center">
        <img
          onClick={() => fileRef.current.click()}
          className="w-30 h-30 rounded-full"
          src={imageUrl == "" ? currentUser.avatar : imageUrl}
          alt="profile pic"
        />
      </div>
      <div className="w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {
            //this input field is hidden it only used to pick image from storage
            //it is called by profile picture click
          }
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleFileChange}
            hidden
          />

          <input
            type="text"
            placeholder=" userName"
            defaultValue={currentUser.userName}
            className=" bg-white p-1.5 rounded-lg"
            id="userName"
            onChange={handleInputChange}
          />

          <input
            type="text"
            defaultValue={currentUser.email}
            placeholder="email"
            className=" bg-white p-1.5 rounded-lg"
            id="email"
            onChange={handleInputChange}
          />

          <input
            type="text"
            placeholder="password"
            className=" bg-white p-1.5 rounded-lg"
            id="password"
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="text-center hover:opacity-90 text-white rounded-lg p-2 bg-slate-700 uppercase"
          >
            Update
          </button>

          <Link
            className="text-center p-2 bg-green-700 rounded-lg uppercase hover:opacity-90 hover: cursor-pointer"
            to="/create-listing"
          >
            Create Listing
          </Link>
        </form>
      </div>
      <div className="flex w-lg justify-between text-red-700 mt-3">
        <span onClick={deleteUser} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={signOut} className="cursor-pointer">
          Sign Out
        </span>
      </div>

      <div className="flex w-lg justify-between text-red-700 mt-3">
        <span className="">{error ? error : ""}</span>
        <span className="text-green-700">
          {updateSuccess ? "user updated Successfully!" : ""}
        </span>
      </div>

      <button onClick={handleShowListing} className="text-green-700 hover:cursor-pointer hover:underline">
        show listings
      </button>
      <p className="text-red-700">{showListingError && showListingError}</p>


    <div className="flex flex-col gap-6">
      {userListings.length > 0 &&
        
        userListings.map((listing) => {
          return <div className="w-lg flex items-center gap-6 shadow-xl p-3 bg-amber-30">
                <Link to={"/listing/"+listing._id}>
                  <img
                    className="w-25 h-25 object-cover"
                    src={listing.imagesUrls[0]}
                    alt="listing image"
                  />
                </Link>

                <Link to={"/listing/"+listing._id} className="flex-1">
                <p className="max-w-[250px] font-semibold hover:underline truncate">{listing.name}</p>
                </Link>

                <div className="flex flex-col ml-auto">
                  <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 hover:cursor-pointer hover:underline">Edit</button>
                  </Link>
                  <button onClick={()=>delListing(listing._id)} className="text-red-700 hover:cursor-pointer">Delete</button>
                </div>
              </div>
        

        
        })}
        </div>
    </div>
  );
};

export default Profile;

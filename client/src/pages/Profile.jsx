/* eslint-disable no-unused-vars */
import React from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/user.slice";

export default function Profile() {
  const fileRef = useRef(null);
  const user = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState("");
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [user_success, setUserSuccess] = useState(false);

  useEffect(() => {
    if (!file) return;

    handleFileUpload(file);
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/${user.currentUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data.user));
      setUserSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDelete = async () => {

    try {
      const res = await fetch(`/api/user/${user.currentUser._id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (!data.success) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }


  }
  const handleSignOut = async () => {

    try {

      dispatch(signOutUserStart());

      const res = await fetch('/api/auth/signout');

      const data = await res.json();

      if (!data.success) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data.message))

    }
    catch (err) {
      
      dispatch(signOutUserFailure(err.message))
    }
    


  }

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-center font-semibold text-3xl my-7"> Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
          type="file"
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || user.currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error uploading the image</span>
          ) : progress > 0 && progress < 100 ? (
            <span className="text-green-700">Uploading... {progress}</span>
          ) : progress === 100 ? (
            <span className="text-green-700">Uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          defaultValue={user.currentUser.username}
          type="text"
          name="username"
          placeholder="username"
          className="border p-2 rounded-lg"
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        />
        <input
          defaultValue={user.currentUser.email}
          type="email"
          name="email"
          placeholder="email"
          className="border p-2 rounded-lg"
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          className="border p-2 rounded-lg"
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        />
        <button
          disabled={user.loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
        >
          {user.loading ? "Loading..." : "Update"}
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer"> Delete Account</span>
        <span onClick = {handleSignOut} className="text-red-700 cursor-pointer"> Sign Out</span>
      </div>
        
    
      {user.error && <p className="text-red-700 mt-5">{user.error}</p>}

      {user_success && (
        <p className="text-green-700">User updated successfully</p>
      )}
    </div>
  );
}

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

export default function Profile() {
  const fileRef = useRef(null);
  const user = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState("");
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({});
  console.log(progress, formData);

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

  console.log(file);
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-center font-semibold text-3xl my-7"> Profile</h1>

      <form className="flex flex-col gap-4">
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
          {fileUploadError ? 
          (<span className="text-red-700">Error uploading the image</span>) :
         ( progress >0 && progress < 100  ? (<span className="text-green-700">Uploading... {progress}</span>)  
          : (progress === 100 ? (<span className="text-green-700">Uploaded</span>) : ""))}
        </p>
        <input
          type="text"
          name="username"
          placeholder="username"
          className="border p-2 rounded-lg"
        />
        <input
          type="email"
          name="email"
          placeholder="email"
          className="border p-2 rounded-lg"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          className="border p-2 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95">
          Update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer"> Delete Account</span>
        <span className="text-red-700 cursor-pointer"> Sign Out</span>
      </div>
    </div>
  );
}

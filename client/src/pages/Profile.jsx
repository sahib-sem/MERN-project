/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {

  const user = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-center font-semibold text-3xl my-7"> Profile</h1>


      <form className="flex flex-col gap-4">

      <img src={user.currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />

      <input type="text" name = 'username' placeholder="username" className="border p-2 rounded-lg" />
      <input type="email" name = 'email' placeholder="email" className="border p-2 rounded-lg" />
      <input type="password" name = 'password' placeholder="password" className="border p-2 rounded-lg" />

      <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95">Update</button>

      </form>

      <div className="flex justify-between mt-5">
        <span className = 'text-red-700 cursor-pointer'> Delete Account</span>
        <span className = 'text-red-700 cursor-pointer'> Sign Out</span>
        
      </div>

      


    </div>
  );
}

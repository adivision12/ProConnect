import React, { useState } from "react";
import AllUsers from "../Users/Users";
import { useNavigate } from "react-router";

export default function RightSideBar({allUsers}) {
  // Dummy suggested connections
    // const [allUsers, loading] = AllUsers();
  
    // console.log("allUsers in right sidebar", allUsers);
  //     const suggestions = [
  //   { id: 1, name: "Rohit Sharma", role: "Frontend Dev" },
  //   { id: 2, name: "Priya Singh", role: "Data Analyst" },
  //   { id: 3, name: "Aman Kumar", role: "Backend Dev" },
  // ];
  // console.log("allUsers in right sidebar", allUsers);
    const navigate = useNavigate();

  const suggestions =allUsers.slice(0, 3).map(userObj => (
    // console.log("userObj in suggestions", userObj),
    {
    
    id: userObj?.userId?._id,
    name: userObj?.userId?.name,
    role: userObj?.userId?.bio || "No bio available",
    profilePicture: userObj?.userId?.profilePicture || "/default-avatar.png"
  })
  
);

  // console.log("suggestions=", suggestions[0]);
  // Dummy trending tags
  const tags = ["#DSA", "#MERNStack", "#PlacementPrep", "#Internship"];
  const [authUser]=AllUsers();


    const clickUser = (id) => {
    if (id === authUser?.user?._id) {
      navigate('/profile');
    } else {
      navigate(`/userProfile/${id}`);
    }
  };
  return (
    <div className="bg-white p-4 h-full rounded-xl shadow space-y-6">
      {/* Suggested Connections */}
      <div>
        <h4 className="font-semibold mb-3 text-md">People you may know</h4>
        {suggestions.map((user) => (
          <div
          
            key={user.id}
            className="flex space-x-4 items-center mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
          >
                         <img
                       referrerPolicy="no-referrer"
                        src={user.profilePicture }
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover border"
                      />
            <div onClick={() => clickUser(user.id)}>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            {/* <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full">
              Connect
            </button> */}
          </div>
        ))}
      </div>

      {/* Trending Tags */}
      <div>
        <h4 className="font-semibold mb-3 text-sm">Trending Topics</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-blue-50 cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

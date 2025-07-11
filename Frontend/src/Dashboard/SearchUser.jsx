import React, { useState, useEffect } from 'react';
import { useDataContext } from '../Context/DataProvider'; // Assuming user data is from context
import { Link } from 'react-router-dom';
import AllUsers from '../Users/Users';
import { useAuth } from '../Context/AuthProvider';

const SearchUser = () => {
    const [allUsers]=AllUsers();// allUsers should be fetched from DB
    const [authUser]=useAuth();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

//   console.log(allUsers)
 const users=allUsers?.filter((user)=>{
  if(authUser?.user._id != user._id){
    return user;
  }
 })
  useEffect(() => {
    if (search.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = users.filter(user =>
      user.userId.name.toLowerCase().includes(search.toLowerCase())
    );
    setResults(filtered);
  }, [search, users]);

  // console.log(results)
  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 rounded-full border shadow focus:outline-none"
      />

      {search && results.length > 0 && (
        <div className="absolute z-50 w-full bg-white border shadow-lg mt-1 rounded-md max-h-60 overflow-y-auto">
          {results.map(user => (
            <Link
              to={`/userProfile/${user.userId._id}`}
              key={user._id}
              onClick={() => setSearch('')}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 transition"
            >
              <img
                src={user.userId.profilePicture || "/default-avatar.png" }
                alt="dp"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium">{user.userId.name}</p>
                <p className="text-xs text-gray-500">{user.userId.bio}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchUser;

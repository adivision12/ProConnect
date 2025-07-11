import React from 'react';
import AllUsers from '../Users/Users';
import dp from './../assets/dp.jpg';
import { useAuth } from '../Context/AuthProvider';
import { useNavigate } from 'react-router';
import useController from '../stateManagement/useController';

export default function Users() {
  const [allUsers, loading] = AllUsers();
  const [authUser] = useAuth();
  const navigate = useNavigate();
  const { selected, setSelected } = useController();

  const clickUser = (id) => {
    if (id === authUser?.user?._id) {
      navigate('/profile');
    } else {
      navigate(`/userProfile/${id}`);
    }
  };

  return (
    <div className="hidden lg:block lg:w-[25%] border-2 p-6 bg-white m-6 rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Suggested Users</h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && allUsers?.length === 0 && (
        <p className="text-gray-500">No users found</p>
      )}

      {!loading &&
        allUsers?.slice(0, 5).map((userObj) => {
          const user = userObj.userId;
          if (!user) return null;

          return (
            <div
              key={user._id}
              onClick={() => clickUser(user._id)}
              className="flex items-center gap-3 mb-4 hover:bg-gray-100 p-2 rounded cursor-pointer transition"
            >
              <img
                src={user.profilePicture ? user.profilePicture : dp}
                alt={user.name}
                className="h-10 w-10 rounded-full border border-gray-400 object-cover"
              />
              <div>
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">{user.bio || 'No bio yet'}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
}

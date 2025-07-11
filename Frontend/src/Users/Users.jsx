// useAllUsers.js
import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthProvider';

export default function AllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authUser] = useAuth();

  useEffect(() => {
    const token =
      authUser?.token ||
      (localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")).token : null) ||
      authUser?.user?.token;

    const getAllUsers = async () => {
      if (!token) return;

      try {
        const result = await fetch("/api/user/getAllUsers", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await result.json();
        
        const users=data.allUsers.reverse();
        
        setAllUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllUsers();
  }, [authUser]);

  return [allUsers, loading];
}

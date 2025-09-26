import React from 'react'
import { useEffect,useState } from 'react'
import { useAuth } from '../Context/AuthProvider';
// import Cookies from "js-cookie";
export default function AllUsers() {
    const [allUsers,setAllUsers]=useState([]);
    const [loading,setLoading]=useState();
    const [authUser,setAuthUser]=useAuth();

    if (JSON.parse(localStorage.getItem("user")).token || authUser.user.token) {
    useEffect(()=>{
        setLoading(true);
         const getAllUsers=async()=>{
            // const token=Cookies.get("jwt");
            const token=authUser.token;
            // console.log("token",token);
            let result = await fetch("/api/user/getAllUsers", {
                method: "GET",
                Credentials:"include",
                headers:{
                    authorization:`Bearer ${token}`,
                },
                
                body: JSON.stringify(),
            })
             const data = await result.json();
            // console.log(data);
            const updated=data.allUsers.filter((userObj)=>{
              if(userObj.userId._id!=authUser.user._id){
                return userObj;
              } 
            })
            updated.reverse();
            setAllUsers(updated);
            setLoading(false);
         
        }
         
            // if (localStorage.getItem("userInfo")) {

            
                getAllUsers();
            // }
         
    },[])
    return [allUsers,loading];
}

 
// return (<></>)
}

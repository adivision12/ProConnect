import React from 'react'
import { useEffect,useState } from 'react'
import { useAuth } from '../Context/AuthProvider';
// import Cookies from "js-cookie";
export default function AllPosts() {
    const [allPosts,setAllPosts]=useState([]);
    const [loading,setLoading]=useState();
    const [authUser,setAuthUser]=useAuth();

   
    useEffect(()=>{
        setLoading(true);
         const getAllPosts=async()=>{
            // const token=Cookies.get("jwt");
            // const token=authUser.token;
            // console.log("token",token);
            let result = await fetch("/api/posts", {
                method: "GET",
                Credentials:"include",
                headers:{
                    authorization:`Bearer `,
                },
                
                body: JSON.stringify(),
            })
             const data = await result.json();
            // console.log(data);
            data.reverse();
            setAllPosts(data);
            setLoading(false);
         
        }
         
            // if (localStorage.getItem("userInfo")) {

            
                getAllPosts();
            // }
         
    },[])
    return [allPosts,loading];
}

 

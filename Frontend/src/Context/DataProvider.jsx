import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";


 const DataContext=createContext();

 export const useDataContext=()=>{
    return useContext(DataContext);
 }
 
export const DataProvider=({children})=>{
    // const [socket,setSocket]=useState();
    const [authUser,setAuthUser]=useAuth();
const [isOpen,setIsOpen]=useState(false);
const [isOpenAbout,setIsOpenAbout]=useState(false);
const [userProfile,setUserProfile]=useState(false);
const [currUserProfile,setCurrUserProfile]=useState();
const [openUpdateEduForm,setOpenUpdateEduForm]=useState(false);
const [postForm, setPostForm] = useState(false);
  const [location,setLocation] = useState("India");
  const user = authUser?.user;
  
useEffect(() => {
  fetch('http://ip-api.com/json/')
    .then(res => res.json())
    .then(data => {
    //   console.log("User is from:", data.city, data.regionName, data.country);
      setLocation(data.city+" "+ data.regionName+ " "+data.country);
    });
}, []);
// console.log(userProfile)

    useEffect(()=>{
        if(authUser){
             const getUserProfile=async()=>{
            // const token=Cookies.get("jwt");
            const token=authUser.token?authUser.token:authUser.user.token;
            // console.log("token",token);
            let result = await fetch(`/api/get_user_and_profile`, {
                method: "GET",
                Credentials:"include",
                headers:{
                    authorization:`Bearer ${token}`,
                },
                
                body: JSON.stringify(),
            })
             const data = await result.json();
            // console.log(data);

            // setCurrUserProfile(data.profile);
            // setLoading(false);
         
        }
               getUserProfile();
        }
       },[authUser])

    return(
        <DataContext.Provider value={{isOpen,isOpenAbout,setIsOpenAbout,setIsOpen,location,postForm, setPostForm,openUpdateEduForm,setOpenUpdateEduForm,currUserProfile,setCurrUserProfile,userProfile,setUserProfile}}>
            {children}
        </DataContext.Provider>
    )};
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

export const ConnectionContext = createContext();

export default function ConnectionsProvider({ children }) {
      const [authUser] = useAuth();
    const [connectionRequests,setConnectionRequests] =useState([]);
    const [myConnections,setMyConnections] =useState([]);

      const token=authUser?.token?authUser.token:authUser?.user.token;
      useEffect(()=>{
        //   setLoading(true);
          if(token){
             const getConnectionReq=async()=>{
              // const token=Cookies.get("jwt");
              // console.log("token",token);
              let result = await fetch("/api/user/get_my_Connection_req", {
                  method: "GET",
                  Credentials:"include",
                  headers:{
                      authorization:`Bearer ${token}`,
                  },
              })
               const data = await result.json();
            //   console.log(data);
             setConnectionRequests(data.connections)
            //   setLoading(false);
            }
                  getConnectionReq();
             const getMyConnection=async()=>{
              // const token=Cookies.get("jwt");
             
              // console.log("token",token);
              let result = await fetch("/api/user/getMyAll_Connections", {
                  method: "GET",
                  Credentials:"include",
                  headers:{
                      authorization:`Bearer ${token}`,
                  },
              })
               const data = await result.json();
            //   console.log(data);
             setMyConnections(data.myConnections)
            //   setLoading(false);
            }
                  getMyConnection();


          }
              // }
           
      },[])
    //   console.log(myConnections)
    return (
        <ConnectionContext.Provider value={{myConnections, connectionRequests }}>
            {children}
        </ConnectionContext.Provider>
        
    )
}
 
export const useConnections = () => useContext(ConnectionContext);

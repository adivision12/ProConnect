import React from 'react'
import NavBar from './NavBar'
import ShortProfile from './ShortProfile'
import Posts from './Posts'
import Users from './Users'
import { Navigate } from 'react-router'
import { useDataContext } from '../Context/DataProvider'

export default function DashBoard() {
  return (
    <div className='bg-gray-200 ' >
        <NavBar/>
        <div className=' flex flex-col lg:flex-row w-full '>
            <ShortProfile  />
            <Posts/>
            <Users/>
        </div>

    </div>
  )
}

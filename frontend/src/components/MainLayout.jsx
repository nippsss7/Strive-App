/* eslint-disable no-unused-vars */
import { Outlet, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { House, UserPen, Send, Search, Upload, LogOut } from 'lucide-react'
import { BellDot } from 'lucide-react'
import { toast } from 'sonner'
import NewPostDialog from './NewPostDialog'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import SuggestedUsers from './SuggestedUsers'
import AllProfileDialog from './AllProfileDialog'
import { setPosts, setSelectedPost } from '@/redux/postSlice'

const MainLayout = () => {
  const options = [
    { icon: <House />, text: 'Home', link: '/home' },
    { icon: <Search />, text: 'For You', link: '/profile' },
    { icon: <BellDot />, text: 'Notifications', link: '/profile' },
    { icon: <Upload />, text: 'New Post', link: '/addpost' },
  ]

  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate()

  if(!user){
    console.log("there is no user!")
    navigate('/login');
  }

  const logoutHandler = async (e) => {
    try {
      e.preventDefault();
      const res = await fetch('/api/v1/user/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Include credentials in the request
      })

      const data = await res.json()
      console.log(data)
      console.log(data.success)
      toast(data.message);
      console.log(data.status)

      if (data.success) {
        navigate('/login');
        dispatch(setAuthUser(null));
        // dispatch(setSelectedPost(null));
        dispatch(setPosts([]))
      }

    } catch (error) {
      console.log(error)
      console.log("unable to logout")
    }
  }

  const sideBarHandler = async (text) => {
    if (text === "Home") {
      navigate('/home');
    }
    else if (text === "For You") {
      navigate('/profile');
    }
    else if (text === "Notifications") {
      navigate('/profile');
    }
    else if (text === "New Post") {
      await setIsOpen(true);
      console.log("clicked new post")
      console.log(isOpen)
    }
  }

  const goToProfile = async (clickedId) => {
    console.log(clickedId);
      navigate(`/profile`, {state: {clickedId}});
  }     


  return (
    <div className='flex w-full h-screen overflow-hidden' >
      <div className="sideBar bg-[#F9F9FA] border shadow-md h-full w-1/6">
        <div className="flex flex-col items-center justify-around pt-[4rem] pb-[6rem] w-full h-full">
          <div className="text-center pb-12  ">
            <div className='w-full h-full bg-[#ff7d1a] p-[3px] rounded-[10px] '>
              <div className='w-full h-full bg-[#ff7d1a] p-2 px-3 rounded-lg border-[3px] border-white'>
                <h1 className="text-2xl font-bold">
                  <span className="text-white font-extrabold">Striv</span>
                  <span className=" text-black">Ve</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center border-b pb-6">
            {options.map((option, index) => (
              <a className='w-full hover:text-[#ff7d1a]' onClick={() => sideBarHandler(option.text)} key={(index)}>
                <div className='flex items-center  w-3/4 m-auto h-12 rounded-lg cursor-pointer'>
                  <p className='mr-3'>{option.icon}</p>
                  <p className="text-md text-gray-70 w-[7rem] font-bold">{option.text}</p>
                </div>
              </a>
            ))}
            <NewPostDialog open={isOpen} setOpen={setIsOpen} />
          </div>
          <div className='w-full px-6 mt-10'>
            <div className='flex flex-col justify-center items-center w-full'>
              <div className='flex flex-row justify-between items-center w-full'>
                <h2 className=' font-bold my-4 '>Your Favorites</h2>
                <p className='text-sm text-gray-500 cursor-pointer' onClick={()=>{setIsProfileOpen(true)}}>all</p>
              </div>
                <AllProfileDialog open={isProfileOpen} setOpen={setIsProfileOpen}/>
              <div className='flex flex-col justify-center w-full'>
                <ul className='flex flex-col justify-center w-full'>
                  <SuggestedUsers />
                </ul>
              </div>
            </div>
          </div>
          <div onClick={logoutHandler} className='absolute bottom-6 left-8 transform rotate-180 text-red-500'> <a href=""> <LogOut onClick={logoutHandler} strokeWidth={3} /></a> </div>
        </div>
      </div>

      <div className="flex flex-col w-5/6 h-full">
        <div className='w-full navbar min-h-24 border shadow-md px-6 z-10 bg-[#F9F9FA]'>
          <div className="flex items-center w-full h-full">
            <div className='w-full'>
              <h1 className='font-bold text-xl'>{`Hello ${user?.username}!`}</h1>
            </div>
            <div className="search w-full">
              <input className='border shadow-sm w-full p-2 rounded-lg' type="text" placeholder="Search" />
              <i className="fa fa-search" />
            </div>
            <div className='cursor-pointer profile w-full flex items-center justify-end' onClick={() => goToProfile(user._id)}>
              <img src={user?.profilePicture} alt={user?.username} className='cursor-pointer w-[3rem] rounded-full' />
            </div>
          </div>
        </div>

        <div className="flex flex-row w-full h-full">
          <div className="w-4/6 h-full max-h-full overflow-auto overflow-x-hidden flex justify-center items-center">
            <Outlet />
          </div>
          <div className="flex shadow-lg border messages bg-[#F9F9FA] w-2/6 px-6 h-full self-end pt-16 z-0">
            <div>
              <h1 className='font-bold text-xl'>Your Messages</h1>
            </div>
          </div>
        </div>
        <div>

        </div>
      </div>


    </div>
  )
}

export default MainLayout
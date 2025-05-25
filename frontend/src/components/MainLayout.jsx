/* eslint-disable no-unused-vars */
import { Outlet, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { House, UserPen, Send, Search, Upload, LogOut, Home, User, CirclePlus, Bell } from 'lucide-react'
import { BellDot } from 'lucide-react'
import { toast } from 'sonner'
import NewPostDialog from './NewPostDialog'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import SuggestedUsers from './SuggestedUsers'
import AllProfileDialog from './AllProfileDialog'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import Messages from './Messages'
import { SignOutButton, useClerk, UserButton } from '@clerk/clerk-react'
import { useUser } from '@clerk/clerk-react';
import { useAuth } from "@clerk/clerk-react";

const MainLayout = () => {
  const options = [
    { icon: <House />, text: 'Home', link: '' },
    { icon: <Search />, text: 'For You', link: '/profile' },
    { icon: <BellDot />, text: 'Notifications', link: '/profile' },
    { icon: <Upload />, text: 'New Post', link: '/addpost' },
  ]

  const { user } = useUser();
  const dispatch = useDispatch();


  if (!user) {
    return <div>Loading...</div>;
  }

  console.log(user)

  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { getToken, isSignedIn } = useAuth();

  const navigate = useNavigate()


  // useEffect(() => {
  //   const fetchUser = async () => {
  //     console.log("fetching user at MainLayout...")

  //     if (!isSignedIn) return <div>not signed in...</div>;

  //     const token = await getToken(); // ✅ This must return a JWT
  //     if (!token) {
  //       console.error("No token returned from Clerk.");
  //       return;
  //     }

  //     // try {
  //     //   const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/auth`, {
  //     //     method: 'GET',
  //     //     headers: {
  //     //       Authorization: `Bearer ${token}`,
  //     //     },
  //     //     withCredentials: true,
  //     //   })

  //     //   console.log("User profile ensured");
  //     //   console.log("User from backend:", res.data);
  //     // } catch (err) {
  //     //   console.error("Error ensuring user:", err);
  //     // }

  //     try {
  //       const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/login`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         credentials: 'include', // Include credentials in the request
  //       })

  //       const data = await res.json()

  //       console.log("user fetched at MainLayout: ", data.user);
  //       console.log("data: ", data ) 

  //       if (data.success) {
  //         dispatch(setAuthUser(data.user))
  //       }

  //       console.log("API URL: ", `${import.meta.env.VITE_API_URL}/v1/user/login`);


  //     } catch (error) {
  //       console.log(error)
  //       console.log("unable to Login")
  //     }


  //   };
  //   fetchUser();
  // }, [getToken, isSignedIn]);


  // if (!user) {
  //   console.log("there is no user!")
  //   navigate('/login');
  // }

  const { mongoUser} = useSelector(store => store.auth);

  const logoutHandler = async (e) => {
    try {
      e.preventDefault();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/logout`, {
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
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]))
      }

    } catch (error) {
      console.log(error)
      console.log("unable to logout")
    }
  }

  const sideBarHandler = async (text) => {
    if (text === "Home") {
      navigate('/');
    }
    else if (text === "For You") {
      navigate('/profile');
    }
    else if (text === "Notifications") {
      navigate('/profile');
    }
    else if (text === "New Post") {
      await setIsOpen(true);
      // console.log("clicked new post")
      // console.log(isOpen)
    }
  }

  const goToProfile = async (clickedId) => {
    console.log(clickedId);
    navigate(`/profile`, { state: { clickedId } });
  }


  return (
    <div className='flex w-full h-screen overflow-hidden' >
      <div className="sideBar bg-[#F9F9FA] border shadow-md h-full xl:w-1/6 lg:w-1/5 md:w-1/4 hidden sm:block">
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

          <div className="flex flex-col justify-center pl-2 border-b pb-6">
            {options?.map((option, index) => (
              <a className='w-full hover:text-[#ff7d1a]' onClick={() => sideBarHandler(option.text)} key={(index)}>
                <div className='flex items-center m-auto px-2 h-12 rounded-lg cursor-pointer'>
                  <p className='mr-3'>{option.icon}</p>
                  <p className="text-md text-gray-70 w-[7rem] font-bold">{option.text}</p>
                </div>
              </a>
            ))}
            <NewPostDialog open={isOpen} setOpen={setIsOpen} />
          </div>
          <div className='w-full lg:px-4 md:px-3 mt-10'>
            <div className='flex flex-col justify-center items-center w-full max-w-[10rem] m-auto'>
              <div className='flex flex-row justify-between items-center w-full'>
                <h2 className=' font-bold my-4 '>Your Favorites</h2>
                <p className='text-sm text-gray-500 cursor-pointer' onClick={() => { setIsProfileOpen(true) }}>all</p>
              </div>
              <AllProfileDialog open={isProfileOpen} setOpen={setIsProfileOpen} />
              <div className='flex flex-col justify-center w-full'>
                <ul className='flex flex-col justify-center'>
                  <SuggestedUsers />
                </ul>
              </div>
            </div>
          </div>
          <div onClick={logoutHandler} className='absolute bottom-6 left-8 transform rotate-180 text-red-500'>
            <a href=""> <LogOut onClick={logoutHandler} strokeWidth={3} /></a>
          </div>
          <SignOutButton />
        </div>
      </div>

      <div className="flex flex-col w-full sm:w-5/6 h-full">
        <div className='w-full navbar-desktop hidden sm:block min-h-24 border shadow-md px-6 z-10 bg-[#F9F9FA]'>
          <div className="flex items-center justify-between w-full h-full md:pr-10">
            <div className='w-full'>
              {/* <h1 className='font-bold text-xl'>{`Hello ${user?.username}!`}</h1> */}
              <h1 className='font-bold text-xl'>{`Hello ${user.firstName}!`}</h1>
            </div>
            <div className='flex items-center h-full'>
              <div className="search w-full cursor-pointer">
                <Search size={28} strokeWidth={3.25} />
              </div>
              <div className=' cursor-pointer profile w-8/12 flex items-center justify-end' onClick={() => goToProfile(mongoUser._id)}>
                <img src={user?.imageUrl} alt={user?.username} className='cursor-pointer w-[7rem] rounded-full' />
              </div>
            </div>
          </div>
        </div>

        <div className=" w-full navbar-mobile flex items-center justify-between sm:hidden min-h-24 border shadow-md px-6 z-10 bg-[#F9F9FA] rounded-b-lg">
          <div className='w-[6.8rem] h-[3.5rem] bg-[#ff7d1a] p-[3px] rounded-[10px] '>
            <div className='w-full h-full bg-[#ff7d1a] p-2 px-3 rounded-lg border-[3px] border-white'>
              <h1 className="text-xl font-bold">
                <span className="text-white font-extrabold">Striv</span>
                <span className=" text-black">Ve</span>
              </h1>
            </div>
          </div>

          <div className='flex gap-3 items-center'>
            <div>
              <p> <Bell strokeWidth={3} /> </p>
            </div>
            <div className='cursor-pointer profile w-full flex items-center justify-end' onClick={() => goToProfile(user._id)}>
              <img src={user?.profilePicture} alt={user?.username} className='cursor-pointer w-[1rem] rounded-full' />
            </div>
          </div>
        </div>

        <div className="flex flex-row w-full h-full">
          <div className="w-full h-full max-h-full overflow-auto overflow-x-hidden flex justify-center items-center">
            <Outlet />
          </div>
          <Messages />
        </div>
        <div>

        </div>
        <div className='home-bar fixed bottom-0 h-[4rem] bg-[#F9F9FA] border shadow-md  flex justify-center items-center rounded-t-[2rem] w-screen sm:hidden'>
          <ul className='flex justify-around w-full px-5'>
            <li onClick={() => { navigate('/'); }} > <Home strokeWidth={3} /> </li>
            <li onClick={() => { setIsOpen(true); }}> <CirclePlus strokeWidth={3} /> </li>
            <li onClick={() => goToProfile(user._id)}> <User strokeWidth={3} /> </li>
          </ul>
        </div>
      </div>


    </div>
  )
}

export default MainLayout
/* eslint-disable no-unused-vars */
import { Outlet, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { House, Search, LogOut, Home, User, CirclePlus, Bell, Compass } from 'lucide-react'
import { BellDot } from 'lucide-react'
import { toast } from 'sonner'
import NewPostDialog from './NewPostDialog'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import SuggestedUsers from './SuggestedUsers'
import AllProfileDialog from './AllProfileDialog'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import Messages from './Messages'
import { useUser } from '@clerk/clerk-react';

const MainLayout = () => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();
  const { mongoUser } = useSelector(store => store.auth);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#ff7d1a] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { icon: <House size={20} />, text: 'Home', action: () => navigate('/') },
    { icon: <Compass size={20} />, text: 'Explore', action: () => navigate('/profile') },
    { icon: <BellDot size={20} />, text: 'Notifications', action: () => navigate('/profile') },
    { icon: <CirclePlus size={20} />, text: 'New Post', action: () => setIsOpen(true) },
  ];

  const logoutHandler = async (e) => {
    e?.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/logout`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        toast.success('Logged out successfully');
        navigate('/');
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const goToProfile = (id) => {
    navigate(`/profile`, { state: { clickedId: id } });
  };

  return (
    <div className='flex w-full h-screen overflow-hidden pb-[4rem] md:pb-0'>
      {/* Sidebar */}
      <aside className="hidden sm:flex flex-col bg-white border-r border-gray-100 shadow-sm h-full xl:w-[220px] lg:w-[200px] md:w-[180px] shrink-0">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-gray-100">
          <div className='inline-flex items-center gap-1 bg-[#ff7d1a] rounded-xl px-3 py-2 shadow-sm'>
            <span className="text-white font-black text-xl tracking-tight">Strive</span>
          </div>
        </div>

        {/* Scrollable middle — nav + people */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Nav items */}
          <nav className="flex flex-col gap-1 px-3 py-4">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-[#ff7d1a]/10 hover:text-[#ff7d1a] font-medium text-sm transition-all duration-150 w-full text-left'
              >
                {item.icon}
                <span>{item.text}</span>
              </button>
            ))}
            <NewPostDialog open={isOpen} setOpen={setIsOpen} />
          </nav>

          {/* People */}
          <div className='px-4 pt-3 pb-4 border-t border-gray-100'>
            <div className='flex items-center justify-between mb-2'>
              <h2 className='font-semibold text-xs text-gray-500 uppercase tracking-wider'>People</h2>
              <button
                className='text-xs text-[#ff7d1a] font-medium hover:underline'
                onClick={() => setIsProfileOpen(true)}
              >
                See all
              </button>
            </div>
            <AllProfileDialog open={isProfileOpen} setOpen={setIsProfileOpen} />
            <div className='flex flex-col gap-0.5'>
              <SuggestedUsers limit={6} />
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className='px-4 py-4 border-t border-gray-100 shrink-0'>
          <button
            onClick={logoutHandler}
            className='flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors text-sm font-medium w-full'
          >
            <LogOut size={18} strokeWidth={2} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Desktop navbar */}
        <header className='hidden sm:flex items-center justify-between w-full min-h-[4.5rem] border-b border-gray-100 shadow-sm px-6 bg-white z-10 shrink-0'>
          <div>
            <h1 className='font-bold text-lg text-gray-800'>
              Welcome back, <span className='text-[#ff7d1a]'>{user.firstName}!</span>
            </h1>
          </div>
          <div className='flex items-center gap-4'>
            <button className='p-2 rounded-full hover:bg-gray-100 transition-colors'>
              <Search size={20} className='text-gray-600' strokeWidth={2.5} />
            </button>
            <button
              className='flex items-center gap-2 hover:opacity-80 transition-opacity'
              onClick={() => goToProfile(mongoUser?._id)}
            >
              <img
                src={user?.imageUrl}
                alt={user?.username}
                className='w-9 h-9 rounded-full object-cover ring-2 ring-[#ff7d1a]/30'
              />
            </button>
          </div>
        </header>

        {/* Mobile navbar */}
        <header className="sm:hidden flex items-center justify-between w-full min-h-[4rem] border-b border-gray-100 shadow-sm px-4 bg-white z-10 shrink-0">
          <div className='inline-flex items-center bg-[#ff7d1a] rounded-xl px-3 py-1.5'>
            <span className="text-white font-black text-lg tracking-tight">Strive</span>
          </div>
          <div className='flex gap-2 items-center'>
            <button className='p-2 rounded-full hover:bg-gray-100 transition-colors'>
              <Bell size={20} strokeWidth={2.5} className='text-gray-600' />
            </button>
            <button onClick={() => goToProfile(mongoUser?._id)}>
              <img
                src={user?.imageUrl}
                alt={user?.username}
                className='w-9 h-9 rounded-full object-cover ring-2 ring-[#ff7d1a]/30'
              />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex flex-row flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center items-start pt-6 pb-[5rem] sm:pb-6 px-4">
            <Outlet />
          </div>
          <Messages />
        </div>
      </div>

      {/* Mobile bottom bar */}
      <nav className='fixed bottom-0 h-[4rem] bg-white border-t border-gray-100 shadow-md flex justify-center items-center rounded-t-2xl w-full sm:hidden z-20'>
        <ul className='flex justify-around w-full px-8'>
          <li>
            <button onClick={() => navigate('/')} className='p-2 rounded-full hover:bg-gray-100 transition-colors'>
              <Home size={22} strokeWidth={2.5} className='text-gray-600' />
            </button>
          </li>
          <li>
            <button onClick={() => setIsOpen(true)} className='p-2 rounded-full hover:bg-gray-100 transition-colors'>
              <CirclePlus size={22} strokeWidth={2.5} className='text-gray-600' />
            </button>
          </li>
          <li>
            <button onClick={() => goToProfile(mongoUser?._id)} className='p-2 rounded-full hover:bg-gray-100 transition-colors'>
              <User size={22} strokeWidth={2.5} className='text-gray-600' />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MainLayout;

/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import './App.css'
import Home from './components/Home'
import LandingPage from './components/LandingPage'
import MainLayout from './components/MainLayout'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Profile from './components/Profile'
import OtherProfile from './components/OtherProfile'
import ProtectedRoute from './components/ProtectedRoute'
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from "@clerk/clerk-react";
import { setAuthUser } from '@/redux/authSlice'

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/profile/:id',
        element: <OtherProfile />
      },
      {
        path: '/',
        element: (<ProtectedRoute> <Home /> </ProtectedRoute>)
      },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])

function App() {
  const { getToken, isSignedIn } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isSignedIn) return;

    const fetchUser = async () => {
      const token = await getToken();
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/login`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
        });

        const data = await res.json();
        if (data.success) {
          dispatch(setAuthUser(data.user));
        }
      } catch (error) {
        console.error("Unable to fetch user:", error);
      }
    };

    fetchUser();
  }, [getToken, isSignedIn]);

  return (
    <div className='font-kumbh'>
      <SignedIn>
        <RouterProvider router={browserRouter} />
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </div>
  )
}

export default App

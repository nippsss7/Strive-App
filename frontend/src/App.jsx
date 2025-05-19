/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button.jsx'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home'
import MainLayout from './components/MainLayout'
import { createBrowserRouter, Navigate, RouterProvider, useNavigate } from 'react-router-dom'
import Profile from './components/Profile'
import OtherProfile from './components/OtherProfile'
import ProtectedRoute from './components/ProtectedRoute'
import Cookies from 'js-cookie'
import { SignedIn, SignedOut, SignInButton, SignUp, UserButton } from "@clerk/clerk-react";
import { SignIn } from '@clerk/clerk-react'
import { useSelector } from 'react-redux'


function App() {
  const user = useSelector((state) => state.auth.mongoUser);

  const token = Cookies.get('token');
  // console.log(token)

  useEffect(() => {
    console.log('Hydrated Redux User:', user);
  }, [user]);

  const browserRouter = createBrowserRouter([
    // {
    //   path: '/',
    //   element: <Navigate to="/home" replace />
    // },
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
    // clerk changes -->
    {
      path: '/signup',
      element: <Signup />,
      // element: <SignUp /> 
    },
    {
      path: '/login',
      element: <Login />, 
      // element: <SignIn /> 
    },
    {
      path: '*',
      element: <Navigate to="/" replace />
    }
  ])

  return (
    <>
      <div className='font-kumbh'>
        <SignedIn>
          {/* <UserButton /> */}
          <RouterProvider router={browserRouter} />
        </SignedIn>
        <SignedOut>
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <SignInButton />
          </div>
        </SignedOut>
      </div>
    </>
  )
}

export default App
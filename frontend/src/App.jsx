/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button.jsx'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home'
import LandingPage from './components/LandingPage'
import MainLayout from './components/MainLayout'
import { createBrowserRouter, Navigate, RouterProvider, useNavigate } from 'react-router-dom'
import Profile from './components/Profile'
import OtherProfile from './components/OtherProfile'
import ProtectedRoute from './components/ProtectedRoute'
import Cookies from 'js-cookie'
import { SignedIn, SignedOut, SignInButton, SignUp, UserButton } from "@clerk/clerk-react";
import { SignIn } from '@clerk/clerk-react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from "@clerk/clerk-react";
import { setAuthUser } from '@/redux/authSlice'



function App() {
  const { getToken, isSignedIn } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {

      if (!isSignedIn) return <div>not signed in...</div>;

      const token = await getToken(); // ✅ This must return a JWT
      if (!token) {
        console.error("No token returned from Clerk.");
        return;
      }

      // try {
      //   const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/auth`, {
      //     method: 'GET',
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //     withCredentials: true,
      //   })

      //   console.log("User profile ensured");
      //   console.log("User from backend:", res.data);
      // } catch (err) {
      //   console.error("Error ensuring user:", err);
      // }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/login`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include', // Include credentials in the request
        })

        const data = await res.json()


        if (data.success) {
          dispatch(setAuthUser(data.user))
        }


      } catch (error) {
        console.log(error)
        console.log("unable to Login")
      }


    };
    fetchUser();
  }, [getToken, isSignedIn]);


  const user = useSelector((state) => state.auth.mongoUser);

  const token = Cookies.get('token');
  // console.log(token)

  useEffect(() => {
    console.log('Hydrated Redux User:', user);
  }, [user]);

  useEffect(() => {
    console.log('Environment Variables:', {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      NODE_ENV: import.meta.env.MODE
    });
  }, []);

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
      // element: <Login />, 
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
          <div className="flex flex-col w-full h-full items-center justify-center min-h-screen">
            {/* <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <SignInButton /> */}
          <LandingPage /> 
          </div>
        </SignedOut>
      </div>
    </>
  )
}

export default App
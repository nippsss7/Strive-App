/* eslint-disable no-unused-vars */
import { useState } from 'react'
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
import OtherProfile from './components/otherProfile'
import ProtectedRoute from './components/ProtectedRoute'
import Cookies from 'js-cookie'

function App() {
  const [count, setCount] = useState(0)

  const token = Cookies.get('token');
  console.log(token)

  const browserRouter = createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/home" replace />
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '/home',
          
          element: ( <ProtectedRoute> <Home/> </ProtectedRoute> )
        },
        {
          path: '/profile',
          element: <Profile/>
        },
        {
          path: '/profile/:id',
          element: <OtherProfile />
        }
      ]
    },
    {
      path: '/signup',
      element: <Signup /> ,
    },
    {
      path: '/login',
      element: <Login />,
    },
  ])

  return (
    <>
      <div className='font-kumbh'>

        <RouterProvider router={browserRouter} />

      </div>
    </>
  )
}

export default App

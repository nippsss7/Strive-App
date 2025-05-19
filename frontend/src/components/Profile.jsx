import { CloudFog, CookingPot, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CommentDialog from './CommentDialog';
import EditProfile from './EditProfile';
import { useDispatch } from 'react-redux';
import { setSelectedPost } from '@/redux/postSlice';
import { UserButton } from '@clerk/clerk-react';
import { useClerk } from '@clerk/clerk-react';

const Profile = () => {
  const location = useLocation();
  const clickedId = location.state?.clickedId;
  console.log('Clicked ID:', clickedId);
  const [user, setUser] = useState(null); // Better initial state
  const [posts, setPosts] = useState(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [post, setPost] = useState(null)

  const { openUserProfile } = useClerk();
  const dispatch = useDispatch();

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
        // dispatch(setSelectedPost(null));
        dispatch(setPosts([]))
      }

    } catch (error) {
      console.log(error)
      console.log("unable to logout")
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/${clickedId}/profile`, {
          method: 'GET',
          credentials: 'include'
        });

        const data = await res.json();
        if (data.success) {
          const currentUser = data.user;
          setUser(currentUser);
        }
      } catch (error) {
        console.log('Unable to fetch user data');
        console.log(error);
      }
    };
    fetchUser();
  }, [clickedId]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/post/userpost/all`, {
          method: "GET",
          credentials: 'include'
          // body: JSON.stringify(input)
        });

        const data = await res.json();
        if (data.success) {
          const currentPosts = data.posts;
          console.log(currentPosts)
          setPosts(currentPosts)
          console.log(posts);
        }

      } catch (error) {
        console.log("unable to fetch posts for profile page!")
        console.log(error)
      }
    }

    fetchPosts()
  }, [])

  const editProfile = async () => {
    console.log("clicked edit profile");
    setIsEditProfileOpen(true)

  }

  // console.log(user);

  return (
    <div className='profilePage h-full w-full'>
      {user && posts ? ( // Conditional rendering
        <div className="flex flex-col py-[3rem] sm:py-[5rem] mx-2">
          <div className='info lg:w-5/6 m-auto border-b pb-[3rem]'>
            <div className="flex lg:gap-[5rem] md:gap-[3rem] gap-[2rem] items-center justify-center">
              <div>
                <img src={user.profilePicture} className='w-[8rem] h-[8rem] sm:w-[12rem] sm:h-[12rem] border rounded-full' alt="profile picture" />
              </div>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col md:items-center items-start md:flex-row lg:gap-4 md:gap-3'>
                  <div className='font-bold text-xl sm:w-[100%]'> {user.username} </div>
                  <div className='flex w-full gap-2 pt-3'>
                    <button className='bg-gray-200 w-[7rem] h-9 hover:bg-gray-300 p-1 px-2 rounded' onClick={() => { openUserProfile() }}> Edit Profile  </button>
                    <EditProfile open={isEditProfileOpen} setOpen={setIsEditProfileOpen} />
                    <button className='bg-gray-200 hover:bg-gray-300 p-1 px-2 rounded' onClick={logoutHandler} > Logout </button>
                  </div>
                </div>
                <div className='flex gap-6'>
                  <div> {user.posts.length} posts</div>
                  <div> {user.followers.length} Followers</div>
                  <div> {user.following.length} following</div>
                </div>
                <div> this is your BIO </div>
              </div>
            </div>
          </div>
          <div className='posts flex flex-wrap w-full md:w-5/6 m-auto pt-12 gap-4 px-2'>
            {posts.map(post => (
              <div
                key={post.id}
                className='w-[calc(33.333%-16px)] flex items-center shadow-md rounded-md overflow-hidden border cursor-pointer'>
                <img
                  src={post.image}
                  onClick={() => { setIsCommentOpen(true); setPost(post); dispatch(setSelectedPost(post)) }}
                  className='w-full h-auto object-cover'
                  alt="Post Image"
                />
              </div>
            ))}
            <CommentDialog open={isCommentOpen} setOpen={setIsCommentOpen} content={post} />
          </div>





        </div>
      ) : (
        <div>Loading...</div> // Placeholder while data is being fetched
      )}
    </div>
  );
};

export default Profile;

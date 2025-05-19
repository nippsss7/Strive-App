import { CloudFog, CookingPot, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CommentDialog from './CommentDialog';
import EditProfile from './EditProfile';
import { useDispatch } from 'react-redux';
import { setSelectedPost } from '@/redux/postSlice';

const OtherProfile = () => {
  const location = useLocation();
  const clickedId = location.state?.id;

  const dispatch = useDispatch();

  console.log('Clicked ID:', clickedId);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [post, setPost] = useState(null)

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
          console.log(user)
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/post/userpost/${clickedId}`, {
          method: "GET",
          credentials: 'include'
        });

        const data = await res.json();
        console.log(data);
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
  }, [clickedId])


  // console.log(user);
  console.log(posts)

  return (

    <div className='profilePage h-full w-full'>
      {user && posts ? ( // Conditional rendering
        <div className="flex flex-col py-[5rem]">
          <div className='info w-5/6 m-auto border-b pb-[3rem]'>
            <div className="flex gap-[5rem] items-center justify-center">
              <div>
                <img src={user.profilePicture} className='w-[12rem] h-[12rem] border rounded-full' alt="profile picture" />
              </div>
              <div className='flex flex-col gap-4'>
                <div className='flex gap-4'>
                  <div className='font-bold text-xl'> {user.username} </div>
                </div>
                <div className='flex gap-6'>
                  <div> {user.posts.length} posts</div>
                  <div> {user.followers.length} Followers</div>
                  <div> {user.following.length} following</div>
                </div>
                <div> this is your BIO</div>
              </div>
            </div>
          </div>
          <div className='posts flex flex-wrap w-4/6 m-auto pt-12 gap-4'>
            {posts?.map(post => (
              <div
                key={post.id}
                className='sm:w-[calc(50%-16px)] md:w-[calc(33.333%-16px)] flex items-center shadow-md rounded-md overflow-hidden border cursor-pointer'>
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

export default OtherProfile;

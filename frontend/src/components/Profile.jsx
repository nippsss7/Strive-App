import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPost } from '@/redux/postSlice';
import { useClerk } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import { Grid3X3, Settings, Loader2 } from 'lucide-react';

const Profile = () => {
  const location = useLocation();
  const clickedId = location.state?.clickedId;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [post, setPost] = useState(null);
  const { isSignedIn, getToken } = useAuth();
  const { openUserProfile } = useClerk();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mongoUser } = useSelector(store => store.auth);

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
        toast.success(data.message);
        navigate('/');
        dispatch(setAuthUser(null));
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const idToFetch = clickedId ?? mongoUser?._id;
    if (!idToFetch) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/${idToFetch}/profile`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (error) {
        console.error('Unable to fetch user data:', error);
      }
    };
    fetchUser();
  }, [clickedId, mongoUser?._id]);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = await getToken();
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/post/userpost/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) setPosts(data.posts);
      } catch (error) {
        console.error('Unable to fetch posts:', error);
      }
    };
    fetchPosts();
  }, []);

  if (!user || !posts) {
    return (
      <div className='flex flex-col items-center justify-center w-full py-20 gap-3'>
        <Loader2 className='animate-spin text-[#ff7d1a]' size={32} />
        <p className='text-gray-400 text-sm'>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className='w-full max-w-[56rem] mx-auto px-4 pb-8'>
      {/* Profile header */}
      <div className='flex flex-col sm:flex-row items-center sm:items-start gap-8 py-8 border-b border-gray-100'>
        {/* Avatar */}
        <div className='shrink-0'>
          <img
            src={user.profilePicture}
            className='w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-[#ff7d1a]/20 shadow-md'
            alt="profile picture"
          />
        </div>

        {/* Info */}
        <div className='flex flex-col gap-4 text-center sm:text-left w-full'>
          <div className='flex flex-col sm:flex-row items-center sm:items-center gap-3'>
            <h1 className='font-bold text-xl text-gray-900'>{user.username}</h1>
            <div className='flex gap-2'>
              <button
                onClick={() => openUserProfile()}
                className='px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5'
              >
                <Settings size={14} />
                Edit Profile
              </button>
              <button
                onClick={logoutHandler}
                className='px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold rounded-lg transition-colors'
              >
                Log out
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className='flex justify-center sm:justify-start gap-8'>
            <div className='text-center'>
              <p className='font-bold text-lg text-gray-900'>{posts.length}</p>
              <p className='text-gray-500 text-sm'>posts</p>
            </div>
            <div className='text-center'>
              <p className='font-bold text-lg text-gray-900'>{user.followers.length}</p>
              <p className='text-gray-500 text-sm'>followers</p>
            </div>
            <div className='text-center'>
              <p className='font-bold text-lg text-gray-900'>{user.following.length}</p>
              <p className='text-gray-500 text-sm'>following</p>
            </div>
          </div>

          {user.bio && (
            <p className='text-gray-700 text-sm max-w-xs'>{user.bio}</p>
          )}
        </div>
      </div>

      {/* Posts grid tab */}
      <div className='flex border-b border-gray-100 mt-2'>
        <div className='flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-900 border-b-2 border-gray-900'>
          <Grid3X3 size={16} />
          Posts
        </div>
      </div>

      {/* Posts grid */}
      {posts.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 gap-3 text-gray-400'>
          <Grid3X3 size={48} strokeWidth={1} />
          <p className='font-medium'>No posts yet</p>
        </div>
      ) : (
        <div className='grid grid-cols-3 gap-1 mt-1'>
          {posts.map(p => (
            <div
              key={p._id}
              className='aspect-square overflow-hidden cursor-pointer group relative bg-gray-100'
              onClick={() => { setIsCommentOpen(true); setPost(p); dispatch(setSelectedPost(p)); }}
            >
              <img
                src={p.image}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                alt="Post"
              />
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200' />
            </div>
          ))}
        </div>
      )}

      <CommentDialog open={isCommentOpen} setOpen={setIsCommentOpen} content={post} />
    </div>
  );
};

export default Profile;

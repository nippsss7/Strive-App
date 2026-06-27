import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPost } from '@/redux/postSlice';
import { useAuth } from '@clerk/clerk-react';
import { Grid3X3, Loader2, UserPlus, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

const OtherProfile = () => {
  const location = useLocation();
  const { id: paramId } = useParams();
  const clickedId = location.state?.id ?? paramId;
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mongoUser } = useSelector(store => store.auth);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [post, setPost] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    if (!clickedId) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/${clickedId}/profile`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setIsFollowing(data.user.followers?.includes(mongoUser?._id));
        }
      } catch (error) {
        console.error('Unable to fetch user data:', error);
      }
    };
    fetchUser();
  }, [clickedId]);

  useEffect(() => {
    if (!clickedId) return;
    const fetchPosts = async () => {
      const token = await getToken();
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/post/userpost/${clickedId}`, {
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
  }, [clickedId]);

  const handleFollowToggle = async () => {
    const token = await getToken();
    setIsFollowLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/followorunfollow/${clickedId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setIsFollowing(!isFollowing);
        setUser(prev => ({
          ...prev,
          followers: isFollowing
            ? prev.followers.filter(id => id !== mongoUser?._id)
            : [...prev.followers, mongoUser?._id]
        }));
        toast.success(data.message);
      }
    } catch (error) {
      toast.error('Failed to follow/unfollow');
    } finally {
      setIsFollowLoading(false);
    }
  };

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
            <button
              onClick={handleFollowToggle}
              disabled={isFollowLoading}
              className={`px-5 py-1.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                isFollowing
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  : 'bg-[#ff7d1a] hover:bg-[#ff7d1a]/90 text-white'
              }`}
            >
              {isFollowLoading ? (
                <Loader2 size={14} className='animate-spin' />
              ) : isFollowing ? (
                <><UserCheck size={14} /> Following</>
              ) : (
                <><UserPlus size={14} /> Follow</>
              )}
            </button>
          </div>

          {/* Stats */}
          <div className='flex justify-center sm:justify-start gap-8'>
            <div className='text-center'>
              <p className='font-bold text-lg text-gray-900'>{user.posts?.length ?? 0}</p>
              <p className='text-gray-500 text-sm'>posts</p>
            </div>
            <div className='text-center'>
              <p className='font-bold text-lg text-gray-900'>{user.followers?.length ?? 0}</p>
              <p className='text-gray-500 text-sm'>followers</p>
            </div>
            <div className='text-center'>
              <p className='font-bold text-lg text-gray-900'>{user.following?.length ?? 0}</p>
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

export default OtherProfile;

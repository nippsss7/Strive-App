import React, { useEffect } from 'react'
import Post from './Post'
import useGetAllPosts from '@/hooks/useGetAllPosts'
import useValidate from '@/hooks/useValidate';
import { useSelector } from 'react-redux';
import store from '@/redux/store';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const { posts } = useSelector(store => store.post)
    const { mongoUser } = useSelector(store => store.auth)
    const { isLoading, error } = useGetAllPosts();

    // if(!user){
    //     navigate('/login');
    // }

    useGetAllPosts();
    // useValidate();

    if (error) {
        return (
            <div className='w-full flex p-4 pb-8 flex-col justify-center items-center gap-4' style={{ height: 'calc(100vh - 100px)' }}>
                <p className="text-red-500">Error loading posts: {error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-[#ff7d1a] text-white rounded-lg hover:bg-[#ff7d1a]/90"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className='w-full flex p-4 pb-8 flex-col justify-center items-center gap-4' style={{ height: 'calc(100vh - 100px)' }}>
                <Loader2 className="h-8 w-8 animate-spin text-[#ff7d1a]" />
                <p className="text-gray-500">Loading posts...</p>
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className='w-full flex p-4 pb-8 flex-col justify-center items-center gap-4' style={{ height: 'calc(100vh - 100px)' }}>
                <p className="text-gray-500">No posts yet</p>
            </div>
        );
    }

    return (
        <div className='w-full flex p-4 pb-8 flex-col justify-start items-center gap-4 overflow-scroll' style={{ height: 'calc(100vh - 100px)' }}>
            {
                posts?.map((post) => <Post post={post} user={mongoUser} />)
            }
        </div>
    )
}

export default Home

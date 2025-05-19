import React, { useEffect } from 'react'
import Post from './Post'
import useGetAllPosts from '@/hooks/useGetAllPosts'
import useValidate from '@/hooks/useValidate';
import { useSelector } from 'react-redux';
import store from '@/redux/store';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const Home = () => {
    const navigate = useNavigate();
    const { posts } = useSelector(store => store.post)
    const { mongoUser } = useSelector(store => store.auth)

    // if(!user){
    //     navigate('/login');
    // }

    useGetAllPosts();
    // useValidate();
    


    return (
        <div className='w-full flex p-4 pb-8 flex-col justify-start items-center gap-4 overflow-scroll' style={{ height: 'calc(100vh - 100px)' }}>
            {
                posts.map((post) => <Post post={post} user={mongoUser} />)
            }
        </div>
    )
}

export default Home

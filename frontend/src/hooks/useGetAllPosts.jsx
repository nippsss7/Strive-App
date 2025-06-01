import { setPosts } from '@/redux/postSlice'
import { useAuth } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllPosts = () => {
    const dispatch = useDispatch()
    const { getToken, isSignedIn } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchAllPost = async () => {
            if (!isSignedIn) return;
            
            setIsLoading(true);
            setError(null);
            
            try {
                const token = await getToken();
                const controller = new AbortController();
                const signal = controller.signal;

                const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/post/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include',
                    signal
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch posts');
                }

                const data = await res.json();
                if (data.success && isMounted) {
                    dispatch(setPosts(data.posts));
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error('Error fetching posts:', error);
                    setError(error.message);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchAllPost();

        return () => {
            isMounted = false;
        };
    }, [isSignedIn, getToken, dispatch]);

    return { isLoading, error };
}

export default useGetAllPosts;
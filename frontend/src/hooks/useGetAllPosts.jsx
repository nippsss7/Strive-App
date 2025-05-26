import { setPosts } from '@/redux/postSlice'
import { useAuth } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllPosts = () => {
    const dispatch = useDispatch()
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        const fetchAllPost = async () => {
            const token = await getToken();
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/post/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                    credentials: 'include'
                })

                const data = await res.json();
                if (data.success) {
                    console.log("hook: ", data.posts)
                    dispatch(setPosts(data.posts))
                }
            } catch (error) {
                console.log('unable to fetch posts by hook')
                console.log(error)
            }
        }
        fetchAllPost()
    }, [])

}

export default useGetAllPosts;
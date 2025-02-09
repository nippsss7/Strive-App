import { setPosts } from '@/redux/postSlice'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllPosts = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await fetch('/api/v1/post/all', {
                    method: 'GET',
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
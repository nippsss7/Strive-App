import { setPosts } from '@/redux/postSlice'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllComments = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPosts = async() => {
        try {
            const res = await fetch(`/api/v1/post/${id}/comment/all`, {
                method: 'POST',
                credentials: 'include'
            })

            const data = res.json();
            if(data.success){
                console.log("hook comments: ", data);
                
            }
            
        } catch (error) {
            console.log("unable to fetch comments through hook")
            console.log(error)
        }
    }
  }, [third])
  

}

export default useGetAllComments
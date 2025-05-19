import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Ellipsis, Forward, Heart, MessageCircle, Send } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import CommentDialog from './CommentDialog';
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { setPosts, setSelectedPost } from '@/redux/postSlice';

const Post = ({ post, user }) => {

  if (!post) {
    return <div>Loading...</div>; // or an appropriate loading/error message
  }
  // if (!post?.author) {
  //   return <div>Invalid Post</div>;
  // }

  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments)
  const [commentCount, setCommentCount] = useState(post.comments.length)
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
  const [likeCount, setLikeCount] = useState(post.likes.length)
  const { posts } = useSelector(store => store.post)

  const dispatch = useDispatch();

  const addComment = async () => {
    console.log("post id is: ", post._id)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/post/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ text: comment })
      })
      const data = await res.json();
      console.log(data.populatedComment);
      const newComment = data.populatedComment
      console.log(comment, 'added on', post._id)

      if (data.success) {
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        setCommentCount(commentCount + 1);
        setComment("")

        // updating post
        const updatedPost = posts.map(p => p._id == post._id ? { ...p, comments: updatedComments } : p )
        console.log(updatedPost);
        dispatch(setPosts(updatedPost));
      }



    } catch (error) {
      console.log("unable to upload comment from frontend (API)")
      console.log(error)
    }
  }


  const likeDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      console.log(action);
      console.log("lilked or dislike")
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/post/${post._id}/${action}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      })
      const data = await res.json();
      console.log(data)
      console.log(action, post._id)

      if (data.success) {
        setLiked(!liked);
        if (action == 'like') {
          setLikeCount(likeCount + 1);
        }
        else {
          setLikeCount(likeCount - 1);
        }
      }

      //updating likes on post redux
      console.log(posts)
      const updatedPostData = posts.map(p =>
        p._id == post._id ? {
          ...p,
          likes: liked ? p.likes.filter(id => id != user._id) : [...p.likes, user._id]
        } : p
      );
      dispatch(setPosts(updatedPostData));


    } catch (error) {
      console.log("unable to like/dislike through API call");
      console.log(error)
    }
  }

  const deletePostHandler = () => {
    // watch yt video from 7:00 hr
  }

  const handleChange = (e) => {
    setComment(e.target.value)
  }



  return (
    <div className=" w-full max-w-[40rem] h-full flex justify-start items-center shadow-md border rounded-2xl bg-[#F9F9FA]">
      <div className="w-full m-auto min-h-full p-4 flex flex-col">
        <div className='p-2 pb-3 flex items-center gap-2'>
          <Avatar>
            <AvatarImage src={post.author[0]?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex w-full items-center justify-between">
            <p className='font-bold w-full'>{post.author[0]?.username || "Unknown User"}</p>
            <div className='w-1/2 text-right p-2'>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none"><Ellipsis /></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="font-bold">About this Account</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-gray-600">Copy Link</DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-600">Share to...</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <figure className="flex flex-col justify-center items-center border w-full m-auto max-h-[30rem] min-h-[30rem] bg-[#fdfdfd] shadow-sm rounded-xl overflow-hidden">
          <img
            src={post.image}
            alt={post.caption || "Post image"}
            className="max-w-full"
            loading="lazy"
          />
        </figure>

        <div className="flex flex-col p-2 pt-4 gap-2">
          <div className="flex flex-row gap-4 ">
            {
              liked ? <FaHeart className='text-red-500 cursor-pointer' onClick={() => likeDislikeHandler()} size={24} /> : <Heart className=' cursor-pointer' onClick={() => likeDislikeHandler()} />
            }
            <MessageCircle className='scale-x-[-1] cursor-pointer' onClick={() => { setIsCommentOpen(true); dispatch(setSelectedPost(post))}} />
            <Send />
          </div>

          <p className='font-bold'>{`${likeCount} Likes`}</p>

          <p> <span className='font-bold'>{`${post.author[0]?.username}`}</span> {`${post.caption}`}</p>

          <button className='text-left text-gray-500' onClick={() => { setIsCommentOpen(true); dispatch(setSelectedPost(post)) }}>{`View ${commentCount} Comments`}</button>
          <CommentDialog open={isCommentOpen} setOpen={setIsCommentOpen} content={post} comment={comment} />

          <div className='border-b flex justify-between'>
            <input type="text" name='comment' value={comment} onChange={handleChange} className='active:bg-transparent bg-transparent py-3 w-full outline-none' placeholder='Add a Comment...' />
            <button className='p-3' onClick={() => addComment()}> <Forward /> </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post

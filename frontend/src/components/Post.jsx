import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bookmark, Ellipsis, Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
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
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const Post = ({ post, user }) => {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post?.comments ?? [])
  const [commentCount, setCommentCount] = useState(post?.comments?.length ?? 0)
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) ?? false)
  const [likeCount, setLikeCount] = useState(post?.likes?.length ?? 0)
  const [isDeleting, setIsDeleting] = useState(false)
  const { posts } = useSelector(store => store.post)
  const dispatch = useDispatch();

  if (!post) return null;

  const isOwner = post.author[0]?._id === user?._id || post.author[0]?._id?.toString() === user?._id?.toString();

  const addComment = async () => {
    if (!comment.trim()) return;
    const token = await getToken();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/post/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ text: comment })
      });
      const data = await res.json();
      if (data.success) {
        const newComment = data.populatedComment;
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        setCommentCount(commentCount + 1);
        setComment("");
        const updatedPost = posts.map(p => p._id === post._id ? { ...p, comments: updatedComments } : p);
        dispatch(setPosts(updatedPost));
      }
    } catch (error) {
      toast.error("Failed to add comment");
    }
  }

  const likeDislikeHandler = async () => {
    const token = await getToken();
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/post/${post._id}/${action}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
        const updatedPostData = posts.map(p =>
          p._id === post._id ? {
            ...p,
            likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        );
        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      toast.error("Failed to update like");
    }
  }

  const deletePostHandler = async () => {
    const token = await getToken();
    setIsDeleting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/post/${post._id}/delete`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        dispatch(setPosts(posts.filter(p => p._id !== post._id)));
        toast.success("Post deleted");
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addComment();
  }

  const goToAuthorProfile = () => {
    const authorMongoId = post.author[0]?._id;
    if (authorMongoId) navigate(`/profile/${authorMongoId}`, { state: { id: authorMongoId } });
  }

  return (
    <div className="w-full max-w-[38rem] flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className='p-4 flex items-center justify-between'>
        <div className='flex items-center gap-3 cursor-pointer' onClick={goToAuthorProfile}>
          <Avatar className="w-10 h-10 ring-2 ring-[#ff7d1a]/20">
            <AvatarImage src={post.author[0]?.profilePicture} />
            <AvatarFallback className="bg-[#ff7d1a]/10 text-[#ff7d1a] font-bold">
              {post.author[0]?.username?.[0]?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className='font-semibold text-sm leading-tight'>{post.author[0]?.username || "Unknown User"}</p>
            <p className='text-xs text-gray-400'>{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none p-1 rounded-full hover:bg-gray-100 transition-colors">
            <Ellipsis size={20} className="text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={goToAuthorProfile} className="cursor-pointer">View Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-gray-500" onClick={() => {
              navigator.clipboard.writeText(window.location.origin + `/profile/${post.author[0]?._id}`);
              toast.success("Link copied!");
            }}>Copy Link</DropdownMenuItem>
            {isOwner && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 focus:text-red-500 font-semibold"
                  onClick={deletePostHandler}
                  disabled={isDeleting}
                >
                  <Trash2 size={14} className="mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Post'}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Image */}
      <figure className="w-full bg-gray-50 overflow-hidden">
        <img
          src={post.image}
          alt={post.caption || "Post image"}
          className="w-full h-auto block"
          style={{ maxHeight: '36rem', objectFit: 'contain' }}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
          }}
        />
      </figure>

      {/* Actions */}
      <div className="px-4 pt-3 pb-1 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={likeDislikeHandler} className="flex items-center gap-1.5 group">
              {liked
                ? <FaHeart className='text-red-500' size={22} />
                : <Heart size={22} className='text-gray-600 group-hover:text-red-400 transition-colors' />
              }
            </button>
            <button onClick={() => { setIsCommentOpen(true); dispatch(setSelectedPost(post)); }} className="group">
              <MessageCircle size={22} className='text-gray-600 group-hover:text-[#ff7d1a] transition-colors scale-x-[-1]' />
            </button>
            <button className="group">
              <Send size={20} className='text-gray-600 group-hover:text-blue-500 transition-colors' />
            </button>
          </div>
          <button className="group">
            <Bookmark size={20} className='text-gray-500 group-hover:text-[#ff7d1a] transition-colors' />
          </button>
        </div>

        <p className='font-semibold text-sm'>{likeCount.toLocaleString()} {likeCount === 1 ? 'like' : 'likes'}</p>

        {post.caption && (
          <p className='text-sm leading-snug'>
            <span className='font-semibold mr-1'>{post.author[0]?.username}</span>
            {post.caption}
          </p>
        )}

        {commentCount > 0 && (
          <button
            className='text-left text-gray-400 text-sm hover:text-gray-600 transition-colors'
            onClick={() => { setIsCommentOpen(true); dispatch(setSelectedPost(post)); }}
          >
            View all {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </button>
        )}

        <CommentDialog open={isCommentOpen} setOpen={setIsCommentOpen} content={post} comment={comment} />
      </div>

      {/* Comment Input */}
      <div className='px-4 py-3 border-t border-gray-100 flex items-center gap-2'>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          className='flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400'
          placeholder='Add a comment...'
        />
        {comment.trim() && (
          <button
            onClick={addComment}
            className='text-[#ff7d1a] font-semibold text-sm hover:text-[#ff7d1a]/80 transition-colors'
          >
            Post
          </button>
        )}
      </div>
    </div>
  )
}

export default Post

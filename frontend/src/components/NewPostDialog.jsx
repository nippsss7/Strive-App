/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import PropTypes from 'prop-types';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { readFileAsDataURL } from '@/lib/utils';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';
import { useAuth } from '@clerk/clerk-react';

const NewPostDialog = ({ open, setOpen }) => {
    const { getToken } = useAuth();
    const imageRef = useRef();
    const dispatch = useDispatch();
    const { posts } = useSelector(store => store.post);

    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');

    const fileChangeHandler = async (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            const dataUrl = await readFileAsDataURL(selected);
            setImagePreview(dataUrl);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setImagePreview(null);
        setFile(null);
        setCaption('');
    };

    const createPostHandler = async (e) => {
        e.preventDefault();
        if (!file) return;
        const token = await getToken();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('caption', caption);
        formData.append('image', file);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/post/addpost`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                dispatch(setPosts([data.post, ...posts]));
                toast.success('Post shared!');
                handleClose();
            } else {
                toast.error(data.message || 'Failed to create post');
            }
        } catch (error) {
            toast.error('Failed to create post');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
            <DialogContent className="w-[92vw] max-w-md rounded-2xl p-0 overflow-hidden" onInteractOutside={handleClose}>
                <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
                    <DialogTitle className="text-base font-bold text-gray-900 m-0">Create Post</DialogTitle>
                    <button onClick={handleClose} className='p-1 rounded-full hover:bg-gray-100 transition-colors'>
                        <X size={18} className='text-gray-500' />
                    </button>
                </div>

                <form onSubmit={createPostHandler} className='p-5 flex flex-col gap-4'>
                    {/* Image upload zone */}
                    <div
                        onClick={() => imageRef.current.click()}
                        className={`cursor-pointer rounded-xl border-2 border-dashed transition-colors flex items-center justify-center overflow-hidden ${
                            imagePreview ? 'border-[#ff7d1a]/40' : 'border-gray-200 hover:border-[#ff7d1a]/50 hover:bg-[#ff7d1a]/5'
                        }`}
                        style={{ minHeight: imagePreview ? '18rem' : '12rem', maxHeight: '20rem' }}
                    >
                        {imagePreview ? (
                            <img src={imagePreview} className='w-full h-full object-contain' alt="Preview" />
                        ) : (
                            <div className='flex flex-col items-center gap-3 py-8 text-gray-400'>
                                <div className='w-14 h-14 rounded-full bg-[#ff7d1a]/10 flex items-center justify-center'>
                                    <ImagePlus size={26} className='text-[#ff7d1a]' />
                                </div>
                                <div className='text-center'>
                                    <p className='font-semibold text-gray-700 text-sm'>Click to upload a photo</p>
                                    <p className='text-xs text-gray-400 mt-1'>JPG, PNG, GIF up to 10MB</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <input ref={imageRef} type="file" accept="image/*" className='hidden' onChange={fileChangeHandler} />

                    {/* Caption */}
                    {imagePreview && (
                        <textarea
                            rows={3}
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Write a caption..."
                            className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-[#ff7d1a]/60 transition-colors placeholder:text-gray-400'
                        />
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!file || isLoading}
                        className='w-full flex items-center justify-center gap-2 bg-[#ff7d1a] hover:bg-[#ff7d1a]/90 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-2.5 rounded-xl transition-all text-sm'
                    >
                        {isLoading ? (
                            <><Loader2 className='h-4 w-4 animate-spin' /> Sharing...</>
                        ) : (
                            'Share Post'
                        )}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

NewPostDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

export default NewPostDialog;

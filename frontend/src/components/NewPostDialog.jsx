/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { FileUp, Loader2 } from 'lucide-react';
import uploadPic from '../assets/upload.svg';
import { readFileAsDataURL } from '@/lib/utils';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const NewPostDialog = ({ open, setOpen }) => {

    const imageRef = useRef();
    const dispatch = useDispatch();
    const {posts} = useSelector(store => store.post)

    const [isLoading, setIsLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState()
    const [file, setFile] = useState("")
    const [caption, setCaption] = useState("")


    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    }

    const createPostHandler = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append('caption', caption);
        formData.append('image', file);
        try {
            const res = await fetch('/api/v1/post/addpost', {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: {
                },
            });

            const data = await res.json()
            console.log(data)
            toast(data.message);

            if(data.success){
                dispatch(setPosts([data.post, ...posts]))
            }

            setOpen(false);
            setImagePreview(null);

        } catch (error) {
            console.error("Unable to create post!");
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogTitle className="text-center text-2xl mb-3">Create a New Post</DialogTitle>
                <form onSubmit={createPostHandler}>
                    <div className="flex flex-col gap-4">
                        <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
                        {
                            imagePreview ? (
                                <div className='flex flex-col gap-4'>
                                    <div onClick={() => imageRef.current.click()} className="selectImage cursor-pointer border border-gray-300 rounded-lg h-[20rem] max-h-[20rem] flex justify-center items-center ">
                                        <img src={imagePreview} className='max-h-full max-w-full object-contain' />
                                    </div>
                                    <input className='border-b px-3 py-1 outline-none' value={caption} onChange={(e) => { setCaption(e.target.value) }} rows={1} name="caption" id="" placeholder='Write Your Caption...'></input>
                                </div>
                            ) : (
                                <div className='flex flex-col gap-6'>
                                    <div onClick={() => imageRef.current.click()} className="selectImage border-2 border-gray-400 rounded-lg h-[15rem] cursor-pointer flex justify-center items-center">
                                        <img src={uploadPic} className='w-full h-full object-fill p-16' />
                                    </div>
                                    <button className=' w-1/4 m-auto bg-blue-700 text-white font-bold py-2 px-4 rounded-lg' disabled onClick={createPostHandler} type="submit">Upload</button>
                                </div>
                            )
                        }

                        {
                            imagePreview && (
                                isLoading ? (
                                    <button className='bg-blue-500 w-auto flex items-center m-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg' type="submit">
                                        Uploading
                                        <Loader2 className='ml-2 h-5 w-5 animate-spin' />
                                    </button>
                                ) : (
                                    <button className='bg-blue-500 w-1/4 m-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg' onClick={createPostHandler} type="submit">Upload</button>
                                )
                            )
                        }

                    </div>
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

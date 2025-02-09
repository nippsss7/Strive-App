import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import React from 'react'
import { DialogHeader } from './ui/dialog'
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import store from '@/redux/store';

const CommentDialog = ({ open, setOpen, content }) => {

    const {selectedPost} = useSelector(store => store.post)
    // console.log(selectedPost)

    return (
        <div className='h-[90%]'>
            <Dialog open={open}>
                <DialogContent className="h-[90%] py-[3rem] min-w-[60%] max-w-[70rem] overflow-hidden flex flex-col justify-center gap-4" onInteractOutside={() => setOpen(false)}>
                    <h1 className="text-center font-bold text-2xl">All Comments</h1>
                    <div className="flex h-full py-3">
                        <div className='w-1/2 h-auto pr-12'>
                            <img className='rounded-md object-cover h-full' src={selectedPost.image} alt="" />
                        </div>
                        {
                            content && content.comments.length > 0 ? (
                                <div className="w-1/2 flex flex-col gap-2 text-gray-500 overflow-scroll overflow-x-hidden">
                                    {selectedPost?.comments.map((comment, index) => (
                                        <div key={index} className="border-b py-2">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={comment.author.profilePicture}
                                                    alt="Author"
                                                    className="w-8 h-8 mr-2 rounded-full"
                                                />
                                                <span className="font-semibold text-black">{comment.author.username}</span>
                                                <p className="text-sm">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            ) : (
                                <div className='w-1/2 flex items-center justify-center text-gray-500'>No Comments to show...</div>
                            )
                        }
                    </div>
                </DialogContent>
            </Dialog>
        </div>

    )
}

CommentDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

export default CommentDialog
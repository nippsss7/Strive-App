import { Dialog, DialogContent } from './ui/dialog';
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import store from '@/redux/store';
import { MessageCircle } from 'lucide-react';

const CommentDialog = ({ open, setOpen }) => {
    const { selectedPost } = useSelector(store => store.post);

    if (!selectedPost) return null;

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) setOpen(false); }}>
            <DialogContent
                className="w-[95vw] max-w-4xl rounded-2xl p-0 overflow-hidden flex flex-col sm:flex-row"
                style={{ maxHeight: '85vh', minHeight: '60vh' }}
                onInteractOutside={() => setOpen(false)}
            >
                {/* Image side */}
                <div className='sm:w-1/2 bg-black flex items-center justify-center shrink-0'>
                    <img
                        className='w-full h-auto block'
                        style={{ maxHeight: '85vh', objectFit: 'contain' }}
                        src={selectedPost.image}
                        alt="Post"
                    />
                </div>

                {/* Comments side */}
                <div className='flex flex-col flex-1 overflow-hidden'>
                    {/* Author header */}
                    <div className='flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0'>
                        <img
                            src={selectedPost.author?.[0]?.profilePicture}
                            alt="author"
                            className='w-9 h-9 rounded-full object-cover'
                        />
                        <p className='font-semibold text-sm text-gray-900'>
                            {selectedPost.author?.[0]?.username || 'User'}
                        </p>
                    </div>

                    {/* Caption */}
                    {selectedPost.caption && (
                        <div className='px-5 py-3 border-b border-gray-100 shrink-0'>
                            <p className='text-sm text-gray-700'>
                                <span className='font-semibold mr-1'>{selectedPost.author?.[0]?.username}</span>
                                {selectedPost.caption}
                            </p>
                        </div>
                    )}

                    {/* Comments list */}
                    <div className='flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-3'>
                        {selectedPost.comments && selectedPost.comments.length > 0 ? (
                            selectedPost.comments.map((comment, index) => (
                                <div key={index} className='flex items-start gap-3'>
                                    <img
                                        src={comment.authorId?.profilePicture}
                                        alt="commenter"
                                        className='w-8 h-8 rounded-full object-cover shrink-0 mt-0.5'
                                    />
                                    <div>
                                        <p className='text-sm'>
                                            <span className='font-semibold text-gray-900 mr-1.5'>
                                                {comment.authorId?.username}
                                            </span>
                                            <span className='text-gray-700'>{comment.text}</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='flex flex-col items-center justify-center h-full gap-3 text-gray-400 py-8'>
                                <MessageCircle size={36} strokeWidth={1.5} />
                                <p className='text-sm font-medium'>No comments yet</p>
                                <p className='text-xs'>Be the first to comment</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

CommentDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

export default CommentDialog;

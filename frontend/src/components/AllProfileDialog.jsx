import React from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import PropTypes from 'prop-types';
import SuggestedUsers from './SuggestedUsers';


const AllProfileDialog = ({open, setOpen}) => {
    return (
        <div className='h-[90%]'>
            <Dialog open={open}>
                <DialogContent onInteractOutside={() => { setOpen(false) }}>
                    <h1 className='font-bold text-2xl'> Explore more </h1>
                    <SuggestedUsers/>
                </DialogContent>
            </Dialog>
        </div>
    )
}

AllProfileDialog.prototypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
}

export default AllProfileDialog
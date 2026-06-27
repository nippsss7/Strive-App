import React from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import PropTypes from 'prop-types';
import SuggestedUsers from './SuggestedUsers';


const AllProfileDialog = ({open, setOpen}) => {
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => { setOpen(false) }}>
                <h1 className='font-bold text-2xl'>Explore People</h1>
                <SuggestedUsers/>
            </DialogContent>
        </Dialog>
    )
}

AllProfileDialog.prototypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
}

export default AllProfileDialog
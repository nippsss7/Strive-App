import { Dialog, DialogContent } from './ui/dialog';
import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import store from '@/redux/store';

const EditProfile = ({ open, setOpen, content }) => {
  const [editForm, setEditForm] = useState({
    profilePicture: ""
  });
  const [currentDP, setCurrentDP] = useState(null)

  const handleChange = (e) => {
    setEditForm({...editForm, [e.target.name]: e.target.value})
    console.log(editForm);
  }

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if(file){
        setCurrentDP(file);
        console.log(currentDP)
    }else{
      console.log("no file")
    }
  }
  

  const updateProfile = async() => {
    try {
      const formData = new FormData();
      if(currentDP){
        formData.append('profilePicture', currentDP);
      }

      const res = await fetch(`/api/v1/user/profile/edit`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      const data = await res.json();

      console.log(data);
      
    } catch (error) {
      console.log("error");
      console.log(error)
    }
  }

  return (
    <div className='h-[70%]'>
      <Dialog open={open}>
        <DialogContent className="h-[70%] py-[3rem] min-w-[50%] max-w-[50rem] overflow-hidden flex flex-col justify-center gap-4" onInteractOutside={() => setOpen(false)}>
          <h1 className="text-center font-bold text-2xl">Edit your Profile</h1>
          <div className="flex flex-col gap-6 h-full w-4/5 justify-center m-auto items-center py-3">
            <div className="flex flex-row justify-around">
              <div className='w-1/2 '>Name: </div>
              <div className='w-1/2'> <input type="text" name='name' className='border rounded-md' /></div>
            </div>

            <div className="flex flex-row justify-around">
              <div className='w-1/2'>email: </div>
              <div className='w-1/2'> <input type="text" name='email' className='border rounded-md' /></div>
            </div>

            <div className="flex flex-row justify-around">
              <div className='w-1/2'>Contact Number: </div>
              <div className='w-1/2'> <input type="text" name='phoneNumber' className='border rounded-md' /></div>
            </div>

            <div className="flex flex-row justify-around">
              <div className='w-1/2'>gender: </div>
              <div className='w-1/2'> <input type="text" name='gender' className='border rounded-md' /></div>
            </div>

            <div className="flex flex-row justify-around">
              <div className='w-1/2'>Bio: </div>
              <div className='w-1/2'> <textarea name="bio" className='border rounded-md' id=""></textarea></div>
            </div>

            <div className="flex flex-row justify-around">
              <div className='w-1/2'>Profile Picture: </div>
              <div className='w-1/2'> <input type="file" name='profilePicture' value={editForm.profilePicture} onChange={fileHandler} className='border rounded-md' /></div>
            </div>

            <button className='bg-gray-200 rounded-md mt-3 p-1 px-6' onClick={()=>updateProfile()}>Save</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

EditProfile.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default EditProfile
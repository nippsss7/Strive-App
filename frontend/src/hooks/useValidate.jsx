import React from 'react'
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const  useValidate = () => {
    const navigate = useNavigate();

useEffect(() => {
    const fetchAuth = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/validate`, {
            method: 'GET',
            credentials: 'include', // Send cookies with the request
        });
        const data = await res.json();
        console.log(data);
        if (!data.success) {
            console.log("not authenticated")
            // navigate('/login'); 
        }
    };
    fetchAuth()
}, [])

}


export default useValidate
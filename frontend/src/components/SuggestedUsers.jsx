import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'

const SuggestedUsers = () => {
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const response = await fetch('/api/v1/user/suggested');
                const data = await response.json();
                if (data.success) {
                    setUsers(data.users);
                }
            } catch (error) {
                console.error('Failed to fetch suggested users:', error);
            }
        };

        fetchSuggestedUsers();
    }, []);

    const goToProfile =(id) => {
        console.log(id);
        navigate(`/profile/${id}`, {state: {id}});
    }

    return (
        <div className="suggestedUers w-full">
            <ul className='w-full'>
                {users.map(user => (
                    <li onClick={()=>{goToProfile(user._id)}} key={user._id} className='flex items-center hover:bg-gray-200 w-full p-2 px-6 gap-2 rounded-md border-b cursor-pointer'>
                        <img src={user.profilePicture} className="w-8 h-8 mr-2 rounded-full" alt={`${user.username}'s profile`} />
                        <span>{user.username}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SuggestedUsers;

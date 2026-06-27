import { useAuth } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const SuggestedUsers = ({ limit }) => {
    const [users, setUsers] = useState([]);
    const { getToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            const token = await getToken();
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/suggested`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.success) setUsers(data.users);
            } catch (error) {
                console.error('Failed to fetch suggested users:', error);
            }
        };
        fetchSuggestedUsers();
    }, []);

    if (users.length === 0) {
        return <p className="text-xs text-gray-400 text-center py-2">No suggestions yet</p>;
    }

    const displayed = limit ? users.slice(0, limit) : users;

    return (
        <div className="flex flex-col gap-0.5">
            {displayed.map(user => (
                <button
                    key={user._id}
                    onClick={() => navigate(`/profile/${user._id}`, { state: { id: user._id } })}
                    className='flex items-center gap-2.5 w-full p-2 rounded-lg hover:bg-[#ff7d1a]/8 transition-colors text-left group'
                >
                    {user.profilePicture ? (
                        <img
                            src={user.profilePicture}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                            alt={user.username}
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                            <User size={14} className="text-gray-400" />
                        </div>
                    )}
                    <span className='text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate'>
                        {user.username}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default SuggestedUsers;

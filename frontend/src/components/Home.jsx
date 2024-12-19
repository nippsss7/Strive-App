import React from 'react'
import Post from './Post'

const Home = () => {
    return (
        <div className='w-full h-full flex flex-col justify-center py-[4rem] items-center'>
            {
                [1, 2, 3, 4].map((item, index) => <Post key={index} />)
            }
        </div>
    )
}

export default Home

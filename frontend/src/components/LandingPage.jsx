import React from 'react'
import LampBg from './lamp-demo'
import { motion } from "framer-motion";

import { SignedIn, SignedOut, SignInButton, SignUp, UserButton } from "@clerk/clerk-react";


const LandingPage = () => {
  return (

    <div className="min-h-screen w-full bg-[#020617]">
      {/* Hero Section */}
      <div className=''>
        <LampBg />
      </div>
      {/* <div>
      <div className="relative w-full h-[0.1] bg-cyan-400 shadow-[0_0_40px_10px_rgba(0,255,255,0.6)]"></div>

      </div> */}

      <div className="relative container mx-auto px-4 h-screen flex flex-col overflow-hidden py-[5rem] md:py-[10rem]">
        <div className='flex text-white justify-center items-center flex-col'>
          <h1 className='text-2xl md:text-6xl mb-5 md:mb-10 font-bold'>What Makes Us Different?</h1>
          <p className='text-sm md:text-xl text-gray-500 mb-8 text-center md:w-[85%] m-auto'>In a world of endless scrolling and meaningless likes, our platform brings authenticity back to social networking. Built with inclusivity and simplicity at its core, this app helps you:</p>
          <div className='relative text-white flex flex-col max-sm:pt-6 max-sm:gap-6 max-sm:text-center end'>
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className='absolute top-[13rem] overflow-hidden md:static'
              src="earth-inside-network-lines.png" alt="" />
            <motion.p
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className='md:absolute top-[7rem] left-0 w-full text-center text-l gmd: font-extrabold text-[#00f0ff] drop-shadow-[0_0_10px_#00f0ff] tracking-wide'>Discover communities that reflect your interests and values
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              className='md:absolute top-[15rem] left-[4rem]  md:text-lg font-extrabold text-[#00f0ff] drop-shadow-[0_0_10px_#00f0ff] tracking-wide'>Share moments with real people</motion.p>
            <motion.p
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 1 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className='md:absolute top-[15rem] right-0  md:text-lg font-extrabold text-[#00f0ff] drop-shadow-[0_0_10px_#00f0ff] tracking-wide'>Enjoy a distraction and ad free experience</motion.p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-10 md:py-20 md:h-screen">
        <div className='text-center h-full flex flex-col'>
          <h1 className='text-3xl sm:text-5xl text-white font-bold mb-20'>Designed for YOU...</h1>
          <div className='w-[90%] sm:w-[70%] max-h-[75%] m-auto flex flex-wrap gap-4 flex-grow justify-center text-white'>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="w-full sm:w-[39%] p-6 rounded-2xl bg-[#ffffff0b] backdrop-blur-md shadow-2xl border-white/20 overflow-hidden relative flex items-center gap-4 h-[50%]">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
                className='relative flex items-center gap-4'>
                <img src="profile.svg" className="w-[40%]" alt="Profile" />
                <p className="w-[55%] text-xl text-gray-300"> <span className='font-bold text-white'>Customizable Profiles – </span> <br /> Make your digital space truly yours.</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className='w-full sm:w-[59%] p-6 rounded-2xl bg-[#ffffff0b] backdrop-blur-md shadow-lg border-white/20 overflow-hidden  relative h-[50%] flex flex-col-reverse justify-center items-center pt-[12%]'>
              <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
              className='flex flex-col-reverse justify-center items-center'>
                <img src="chatting.svg" className='translate-y-[15%] w-[60%]' alt="" />
                <p className='text-xl text-gray-300'> <span className='font-bold text-white'> Real-Time Chats & Stories – </span> <br /> Talk and share like you’re face to face.</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className='w-full sm:w-[59%] p-6 rounded-2xl bg-[#ffffff0b] backdrop-blur-md shadow-lg border-white/20 overflow-hidden h-[50%]'>
              <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
              className='flex flex-col-reverse'>
                <img src="grass.svg" className='  w-[60%] bottom-5 left-10' alt="" />
                <p className='translate-x-14 translate-y-7 top-20 right-20 text-xl text-gray-300 max-sm:pr-8'> <span className='font-bold text-white'> Community First – </span> <br /> Join groups that empower, support, and inspire.</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.4,
              }}
              className='w-full sm:w-[39%] p-6 rounded-2xl bg-[#ffffff0b] backdrop-blur-md shadow-lg border-white/20 overflow-hidden flex items-center max-h-[50%]'>
              <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
              className='flex items-center gap-4'>
                <img src="selfie.svg" className='w-[30%] max-sm:py-10' alt="" />
                <p className=' text-xl text-gray-300'> <span className='font-bold text-white'> Seamless Media Sharing – </span> <br /> Post photos, videos, and reels effortlessly.</p>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-[#FF7D1B] rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Socialize?</h2>
          <p className="text-xl mb-8 opacity-90">
            Be part of a community that celebrates your wins, listens to your story, and grows with you.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
            Join Now
          </button>
        </div>
      </div>

      <div>
        <div className='w-[80%] rounded mx-auto text-white p-12 flex flex-col gap-4'>
          <h1>Strive is more than an app—it's a movement.</h1>
          <p>Connect with like-minded people, stay inspired, and keep striving—every single day.</p>
        </div>
      </div>

      <div className='footer m-1 border border-1 border-white w-auto rounded-lg mt-16 relative overflow-hidden'>
        <div className='absolute bottom-[-6rem] left-[-2.5rem]'>
          <h1 className='text-[12rem] font-bold text-[#ff7d1a39]'>Strive </h1>
        </div>
        <div className='absolute bottom-2 right-2'>
          <p className='text-sm text-gray-400'>© 2025 Strive. All rights reserved.</p>
        </div>
        <div className=' flex h-[30vh] text-white justify-between items-center w-[95%] sm:w-[70%] mx-auto'>
          <div className='flex flex-col items-center  w-[25%]'>
            <h1 className='text-4xl font-bold text-[#ff7d1a]'>Strive</h1>
            <p className='max-sm:text-sm'>Connect. Share. Belong.</p>
          </div>
          <div className='flex flex-col gap-2 items-center'>
            <h1 className=' text-lg font-bold'>Links</h1>
            <a href="" m className='text-sm text-gray-400'>Home</a>
            <a href="" m className='text-sm text-gray-400'>About Us</a>
            <a href="" m className='text-sm text-gray-400'>Why Strive?</a>
          </div>
          <div className='max-sm:w-[45%] flex flex-col gap-4 items-center'>
            <h1>Newsletter</h1>
            <div className='flex max-sm:w-[100%] float-start'>
              <input type="text" placeholder='Enter your email' className='max-sm:w-[100%] bg-transparent border border-1 border-white rounded-l-lg p-2' />
              <button className='bg-white max-sm:w-[40%] max-sm:text-xs text-blue-600 sm:px-8 py-3 rounded-r-lg font-semibold hover:bg-gray-100 transition duration-300'>Join</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
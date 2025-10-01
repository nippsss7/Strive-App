"use client";
import React from "react";
// import { motion } from "framer-motion";
import { motion } from "motion/react"

import { LampContainer } from "@/components/ui/lamp"; // or use relative path if needed
import LandingAvatar from './ui/landingAvatar'
import { UserPlus } from "lucide-react";
import connectingTeams from "./undraw/connectingTeams.svg"

import { SignedIn, SignedOut, SignInButton, SignUp, UserButton } from "@clerk/clerk-react";


export default function LampDemo() {
  return (
    <div className="relative flex flex-col w-full h-screen ">
      <div className="w-full">
        <div className=" absolute w-full top-0 z-50 navbar flex items-center justify-between pl-[10%] pr-[10%] lg:pr-[3%] py-10 md:py-[3rem] lg:py-3">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Strive</h1>
          </div>
          <div className='flex items-center gap-8 justify-around'>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className='bg-white text-black w-20 px-4 py-2 rounded-full font-semibold'>
              <SignInButton > Login </SignInButton>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className=' text-white w-auto border-b-2 px-4 py-2 rounded-md font-semibold hidden md:block'>
              Get the App
            </motion.button>
            {/* <div class="sketchfab-embed-wrapper">
              <iframe
                title="Boy Face"
                frameBorder="0"
                allowFullScreen
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                src="https://sketchfab.com/models/59899bc5937d4d58917764da17b49721/embed?autostart=1&preload=1&transparent=1&ui_controls=0&ui_infos=0&ui_hint=0&ui_watermark=0&ui_annotations=0"
                style={{ width: "100%", height: "500px", border: "none", background: "transparent" }}
              />

            </div> */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className='flex items-center justify-center  h-[10rem] hidden lg:block '>
              {/* <UserPlus strokeWidth={3} color="white" size={35}  /> */}
              {/* <img src="Group.png" className="h-[6rem] z-10" alt="" srcset="" /> */}
              <LandingAvatar className="h-[5rem]" />
            </motion.div>

          </div>
        </div>
      </div>

      <div className="lamp-adjust flex justify-center items-center h-full py-10 md:mt-14">
        <LampContainer className="flex items-center justify-center min-h-screen px-4 sm:px-6">
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            className="text-center bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-transparent"
          >
            <div className="text-control flex flex-col items-center justify-center gap-6 max-sm:mt-[5rem] sm:mt-[13rem] max-sm:mb-[4rem]">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
                <span className="text-[#ff7d1a]">Connect.</span> Share. Belong.
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl">
                Join a new kind of social network — where your voice matters, your identity is celebrated, and your experience is truly yours.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <SignInButton className="bg-[#ff7d1a] text-white px-6 py-3 text-lg rounded-full font-semibold hover:bg-[#a05c28] transition duration-200">
                  Get Started
                </SignInButton>
              </div>
            </div>
          </motion.h1>
        </LampContainer>

      </div>
      {/* <div className="absolute left-[2rem] bottom-[5rem]">
        <img src="undraw_grass.svg" className="w-[70%]" alt="" srcset="" />
      </div> */}
      {/* <div className="relative bottom-[25rem] left-[85rem] w-[20rem]">
        <img src={connectingTeams} alt="" />
      </div> */}
      <div className="absolute bottom-0 w-full h-[0.4] bg-cyan-400 shadow-[0_0_50px_7px_rgba(0,255,255,0.6)]"></div>
    </div>
  );
}

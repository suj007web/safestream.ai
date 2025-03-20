"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {motion} from "framer-motion"
import { X } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {user} = useUser();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(()=>{
    if(user){
    const createUser = async ()=>{
      const response = await fetch('/api/createUser', {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          name : user.fullName,
          email : user.primaryEmailAddress?.emailAddress,
          image : user.imageUrl
        })

      })
      const data = await response.json()
      toast(data.message)
    }
    createUser()
    }
  }, [user]);

  return (
    <nav className="bg-transparent sticky top-0 z-50 backdrop-blur-md">
    
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 ">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image
            src="/logo.png"
            className="h-16 w-auto"
            alt="Logo"
            width={200}
            height={200}
          />
        
        </Link>
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden  dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
         {
            isMenuOpen ? <X size={24} /> :  
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
         }
        </button>
        <motion.div
        animate={{ y: isMenuOpen ? 0 : 20}}

        transition={{ duration: 0.3
         }}
        className={`${isMenuOpen ? "block" : "hidden"} w-full absolute  md:top-5 md:right-20 right-10 top-16 z-50 md:block md:w-auto flex md:justify-center justify-end items-center`} id="navbar-default">
          <ul className="font-medium w-[40%] md:w-full gap-10 flex flex-col md:flex-row md:p-0 p-4 md:p-0  text-white rounded-lg bg-gradient-to-b from-gray-900 to-slate-800  md:bg-none ">
            <li>
              <Link
                href="#whatwedo"
                className="hover:text-blue-500 "
                aria-current="page"
              >
                What we do?
              </Link>
            </li>
       
            <li>
              <Link
                href="#"
                className="hover:text-blue-500 "
              >
                Testimonials
              </Link>
            </li>

            <li>
              { 
              user?
              <Link
                href="/dashboard"
                className="hover:bg-blue-600 bg-blue-500 p-2 rounded-lg"
              >
                Go to Dashboard
              </Link> : 
              <Link
                href="/sign-up"
                className="hover:bg-blue-600 bg-blue-500 p-2 rounded-lg"
              >
                Get Started
              </Link>
              }
            </li>
          
          </ul>
        </motion.div>
      </div>
    </nav>
  )
}
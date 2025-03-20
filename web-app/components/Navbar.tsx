"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {motion} from "framer-motion"
import { X } from "lucide-react"
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-transparent ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
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
        animate={{ y: isMenuOpen ? 0 : 10}}

        transition={{ duration: 0.3
         }}
        className={`${isMenuOpen ? "block" : "hidden"} w-full md:block md:w-auto flex justify-end`} id="navbar-default">
          <ul className="font-medium w-[40%] md:w-full gap-10 flex flex-col md:flex-row p-4 md:p-0 mt-4 text-white rounded-lg bg-black md:bg-transparent ">
            <li>
              <Link
                href="#"
                className=""
                aria-current="page"
              >
                What we do?
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className=""
              >
                Go to Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className=""
              >
                Testimonials
              </Link>
            </li>
          
          </ul>
        </motion.div>
      </div>
    </nav>
  )
}